
import { WasteCategory, DisposalInstruction } from './types';

export const DISPOSAL_DATA: Record<WasteCategory, DisposalInstruction> = {
  [WasteCategory.PLASTIC]: {
    category: WasteCategory.PLASTIC,
    icon: 'fa-bottle-water',
    color: 'bg-blue-500',
    instructions: [
      'Rinse out food residue.',
      'Check for local recycling symbols (e.g., PET 1, HDPE 2).',
      'Crush bottles to save space.'
    ]
  },
  [WasteCategory.PAPER]: {
    category: WasteCategory.PAPER,
    icon: 'fa-newspaper',
    color: 'bg-amber-600',
    instructions: [
      'Keep paper dry and clean.',
      'Flatten cardboard boxes.',
      'Remove plastic tape or excessive staples.'
    ]
  },
  [WasteCategory.GLASS]: {
    category: WasteCategory.GLASS,
    icon: 'fa-wine-bottle',
    color: 'bg-emerald-500',
    instructions: [
      'Remove caps and lids.',
      'Rinse thoroughly.',
      'Separate by color if required by your municipality.'
    ]
  },
  [WasteCategory.METAL]: {
    category: WasteCategory.METAL,
    icon: 'fa-can-food',
    color: 'bg-gray-500',
    instructions: [
      'Wash aluminum cans.',
      'Place loose lids inside the can.',
      'Ensure it is empty of pressurized contents.'
    ]
  },
  [WasteCategory.ORGANIC]: {
    category: WasteCategory.ORGANIC,
    icon: 'fa-leaf',
    color: 'bg-green-600',
    instructions: [
      'Compost fruit and vegetable scraps.',
      'Avoid meat and dairy in home compost bins.',
      'Use certified compostable bags if using a curbside bin.'
    ]
  },
  [WasteCategory.E_WASTE]: {
    category: WasteCategory.E_WASTE,
    icon: 'fa-plug',
    color: 'bg-purple-600',
    instructions: [
      'Do NOT throw in regular trash.',
      'Locate specialized e-waste collection centers.',
      'Wipe personal data before disposal.'
    ]
  },
  [WasteCategory.HAZARDOUS]: {
    category: WasteCategory.HAZARDOUS,
    icon: 'fa-biohazard',
    color: 'bg-red-600',
    instructions: [
      'Handle with care.',
      'Keep in original packaging if possible.',
      'Contact local hazardous waste disposal facility.'
    ]
  },
  [WasteCategory.NON_RECYCLABLE]: {
    category: WasteCategory.NON_RECYCLABLE,
    icon: 'fa-trash-can',
    color: 'bg-zinc-700',
    instructions: [
      'Dispose of in standard landfill bin.',
      'Bag tightly to prevent litter.',
      'Consider alternatives to minimize future waste.'
    ]
  }
};
