
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { WasteCategory, Prediction } from '../types';

let model: mobilenet.MobileNet | null = null;

/**
 * Maps ImageNet labels (MobileNet output) to our custom Waste Categories.
 * This is a "best-effort" mapping based on common object categories.
 */
const CATEGORY_MAPPING: Record<string, WasteCategory> = {
  // Plastic
  'water bottle': WasteCategory.PLASTIC,
  'pill bottle': WasteCategory.PLASTIC,
  'lotion': WasteCategory.PLASTIC,
  'soap dispenser': WasteCategory.PLASTIC,
  'plastic bag': WasteCategory.PLASTIC,
  'shampoo': WasteCategory.PLASTIC,

  // Paper
  'envelope': WasteCategory.PAPER,
  'carton': WasteCategory.PAPER,
  'book': WasteCategory.PAPER,
  'packet': WasteCategory.PAPER,
  'paper towel': WasteCategory.PAPER,
  'tissue': WasteCategory.PAPER,
  'comic book': WasteCategory.PAPER,

  // Glass
  'beer bottle': WasteCategory.GLASS,
  'wine bottle': WasteCategory.GLASS,
  'glass bottle': WasteCategory.GLASS,
  'jar': WasteCategory.GLASS,
  'goblet': WasteCategory.GLASS,
  'beaker': WasteCategory.GLASS,

  // Metal
  'can': WasteCategory.METAL,
  'pot': WasteCategory.METAL,
  'tin': WasteCategory.METAL,
  'hammer': WasteCategory.METAL,
  'wrench': WasteCategory.METAL,
  'screw': WasteCategory.METAL,
  'safety pin': WasteCategory.METAL,

  // Organic
  'banana': WasteCategory.ORGANIC,
  'apple': WasteCategory.ORGANIC,
  'orange': WasteCategory.ORGANIC,
  'lemon': WasteCategory.ORGANIC,
  'pomegranate': WasteCategory.ORGANIC,
  'strawberry': WasteCategory.ORGANIC,
  'pineapple': WasteCategory.ORGANIC,
  'custard apple': WasteCategory.ORGANIC,
  'zucchini': WasteCategory.ORGANIC,
  'cucumber': WasteCategory.ORGANIC,
  'bell pepper': WasteCategory.ORGANIC,
  'head of cabbage': WasteCategory.ORGANIC,
  'broccoli': WasteCategory.ORGANIC,
  'cauliflower': WasteCategory.ORGANIC,
  'ear of corn': WasteCategory.ORGANIC,
  'acorn squash': WasteCategory.ORGANIC,

  // E-waste
  'laptop': WasteCategory.E_WASTE,
  'notebook computer': WasteCategory.E_WASTE,
  'mouse': WasteCategory.E_WASTE,
  'keyboard': WasteCategory.E_WASTE,
  'cellular telephone': WasteCategory.E_WASTE,
  'joystick': WasteCategory.E_WASTE,
  'monitor': WasteCategory.E_WASTE,
  'television': WasteCategory.E_WASTE,
  'remote control': WasteCategory.E_WASTE,
  'hard disc': WasteCategory.E_WASTE,

  // Hazardous
  'battery': WasteCategory.HAZARDOUS,
  'syringe': WasteCategory.HAZARDOUS,
  'spray': WasteCategory.HAZARDOUS,

  // Default Fallbacks
  'ashcan': WasteCategory.NON_RECYCLABLE,
  'garbage truck': WasteCategory.NON_RECYCLABLE,
};

// Substring matching for categories that MobileNet produces many variations of
const KEYWORD_MAPPING: Array<{ keywords: string[], category: WasteCategory }> = [
  { keywords: ['bottle', 'plastic', 'tupperware'], category: WasteCategory.PLASTIC },
  { keywords: ['paper', 'magazine', 'book', 'cardboard'], category: WasteCategory.PAPER },
  { keywords: ['glass', 'jar', 'wine', 'beer'], category: WasteCategory.GLASS },
  { keywords: ['can', 'metal', 'tool', 'tin'], category: WasteCategory.METAL },
  { keywords: ['fruit', 'vegetable', 'food', 'plant', 'flower', 'tree'], category: WasteCategory.ORGANIC },
  { keywords: ['computer', 'phone', 'tablet', 'electronics', 'device', 'remote'], category: WasteCategory.E_WASTE },
  { keywords: ['battery', 'gas', 'chemical'], category: WasteCategory.HAZARDOUS },
];

export async function loadModel(): Promise<void> {
  if (model) return;
  
  // Set backend to webgl for performance
  await tf.ready();
  await tf.setBackend('webgl');
  
  model = await mobilenet.load({
    version: 2,
    alpha: 1.0
  });
}

function resolveCategory(label: string): WasteCategory {
  const normalizedLabel = label.toLowerCase();
  
  // Direct match
  for (const [key, category] of Object.entries(CATEGORY_MAPPING)) {
    if (normalizedLabel.includes(key)) return category;
  }
  
  // Keyword match
  for (const mapping of KEYWORD_MAPPING) {
    if (mapping.keywords.some(k => normalizedLabel.includes(k))) {
      return mapping.category;
    }
  }
  
  // Default if unknown
  return WasteCategory.NON_RECYCLABLE;
}

export async function classifyImage(imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement): Promise<Prediction[]> {
  if (!model) throw new Error("Model not loaded");

  // Get raw ImageNet predictions
  const rawPredictions = await model.classify(imageElement, 10);
  
  // Map and group by waste category
  const categoryScores: Record<string, { totalConfidence: number, originalLabels: string[] }> = {};

  rawPredictions.forEach(pred => {
    const category = resolveCategory(pred.className);
    if (!categoryScores[category]) {
      categoryScores[category] = { totalConfidence: 0, originalLabels: [] };
    }
    categoryScores[category].totalConfidence += pred.probability;
    categoryScores[category].originalLabels.push(pred.className);
  });

  // Convert to formatted Prediction array
  const formattedResults: Prediction[] = Object.entries(categoryScores)
    .map(([category, data]) => ({
      category: category as WasteCategory,
      confidence: data.totalConfidence,
      originalLabel: data.originalLabels[0] // Primary matching label
    }))
    .sort((a, b) => b.confidence - a.confidence);

  // Normalize confidence (Softmax-like approach for top predictions)
  const sum = formattedResults.reduce((acc, curr) => acc + curr.confidence, 0);
  const normalized = formattedResults.map(res => ({
    ...res,
    confidence: res.confidence / sum
  }));

  return normalized.slice(0, 3);
}

export function disposeTensors(): void {
  tf.disposeVariables();
}
