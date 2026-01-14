
export enum WasteCategory {
  PLASTIC = 'Plastic',
  PAPER = 'Paper',
  GLASS = 'Glass',
  METAL = 'Metal',
  ORGANIC = 'Organic / Compost',
  E_WASTE = 'E-waste',
  HAZARDOUS = 'Hazardous',
  NON_RECYCLABLE = 'Non-recyclable'
}

export interface Prediction {
  category: WasteCategory;
  confidence: number;
  originalLabel: string;
}

export interface DisposalInstruction {
  category: WasteCategory;
  icon: string;
  color: string;
  instructions: string[];
}

export type AppMode = 'CAMERA' | 'UPLOAD';

export interface ModelStatus {
  loaded: boolean;
  loading: boolean;
  error: string | null;
  progress: number;
}
