export type ElementCategory =
  | 'alkali-metal'
  | 'alkaline-earth-metal'
  | 'lanthanide'
  | 'actinide'
  | 'transition-metal'
  | 'post-transition-metal'
  | 'metalloid'
  | 'reactive-nonmetal'
  | 'halogen'
  | 'noble-gas'
  | 'unknown';

export type ElementPhase = 'solid' | 'liquid' | 'gas' | 'unknown';
export type ElementBlock = 's' | 'p' | 'd' | 'f';

export interface ChemicalElement {
  number: number;
  symbol: string;
  name: string;
  nameEn: string;
  atomicMass: number;
  period: number;
  group: number;
  block: ElementBlock;
  category: ElementCategory;
  electronConfiguration: string;
  electronShells: number[]; // Electrons per principal energy level (K, L, M, N, O, P, Q)
  electronegativity: number | null; // Pauling scale
  atomicRadius: number | null; // Picometers (pm)
  ionizationEnergy: number | null; // kJ/mol
  electronAffinity: number | null; // kJ/mol
  meltingPoint: number | null; // Celsius (°C)
  boilingPoint: number | null; // Celsius (°C)
  density: number | null; // g/cm³
  phase: ElementPhase; // Phase at 25 °C (298 K)
  oxidationStates: number[];
  yearDiscovered: number | string;
  discoverer: string;
  nameOrigin: string;
  summary: string;
  isPredicted: boolean;
}

export interface SuperheavyHistory {
  elementNumber: number;
  symbol: string;
  name: string;
  synthesizedBy: string;
  year: number | string;
  reaction: string;
  halfLife: string;
  namingStory: string;
  missingDataReason: string;
}

export type CompoundType =
  | 'oxido-basico'
  | 'oxido-acido'
  | 'hidruro-metalico'
  | 'hidracido'
  | 'sal-binaria'
  | 'hidroxido'
  | 'oxoacido'
  | 'oxisal'
  | 'covalente'
  | 'intermetalico'
  | 'peroxido'
  | 'otro';

export type BondType = 'ionico' | 'covalente' | 'intermetalico' | 'inerte';

export interface CompoundNomenclature {
  systematic: string; // IUPAC prefixes (e.g., "trióxido de dihierro")
  stock: string; // Stock Roman numerals (e.g., "óxido de hierro(III)")
  traditional: string; // Classical suffix (e.g., "óxido férrico")
  common?: string; // Common name if applicable (e.g., "agua", "amoníaco")
}

export interface Compound {
  id: string;
  formula: string; // "Fe2O3"
  formulaFormatted: string; // "Fe₂O₃"
  elements: string[]; // ["Fe", "O"]
  nomenclature: CompoundNomenclature;
  type: CompoundType;
  typeLabel: string;
  bondType: BondType;
  description: string;
  isTheoretical: boolean;
  stoichiometry: Record<string, number>;
}

export interface PolyatomicIon {
  formula: string; // "SO4"
  formulaFormatted: string; // "SO₄²⁻"
  name: string; // "sulfato"
  charge: number; // -2
  elements: string[]; // ["S", "O"]
  type: 'anion' | 'cation';
}
