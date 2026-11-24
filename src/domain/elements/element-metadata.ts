import type { ElementCategory, ElementBlock, ElementPhase } from '../chemistry-types';

export interface CategoryMeta {
  key: ElementCategory;
  label: string;
  shortLabel: string;
  color: string; // Mineral lithographic background hex
  textColor: string;
  borderColor: string;
}

export const CATEGORIES_META: Record<ElementCategory, CategoryMeta> = {
  'alkali-metal': {
    key: 'alkali-metal',
    label: 'Metales alcalinos',
    shortLabel: 'Alcalinos',
    color: '#F2D5CE', // Terracota pálido
    textColor: '#6E261A',
    borderColor: '#CFA398',
  },
  'alkaline-earth-metal': {
    key: 'alkaline-earth-metal',
    label: 'Alcalinotérreos',
    shortLabel: 'Alcalinotérreos',
    color: '#F5DFC4', // Ocre arena
    textColor: '#6E4314',
    borderColor: '#D4B48C',
  },
  'transition-metal': {
    key: 'transition-metal',
    label: 'Metales de transición',
    shortLabel: 'Transición',
    color: '#DCE3E8', // Pizarra acero
    textColor: '#243746',
    borderColor: '#B0BEC9',
  },
  'post-transition-metal': {
    key: 'post-transition-metal',
    label: 'Metales post-transición',
    shortLabel: 'Post-transición',
    color: '#D5E6DC', // Verde celadón
    textColor: '#1E4631',
    borderColor: '#A3C4B1',
  },
  'metalloid': {
    key: 'metalloid',
    label: 'Metaloides',
    shortLabel: 'Metaloides',
    color: '#EFE6BE', // Ámbar latón
    textColor: '#5C4D14',
    borderColor: '#CCC089',
  },
  'reactive-nonmetal': {
    key: 'reactive-nonmetal',
    label: 'No metales reactivos',
    shortLabel: 'No metales',
    color: '#D4E6EC', // Aguamarina mineral
    textColor: '#164859',
    borderColor: '#9DC0CC',
  },
  'halogen': {
    key: 'halogen',
    label: 'Halógenos',
    shortLabel: 'Halógenos',
    color: '#DCE0F0', // Cobalto mineral
    textColor: '#283061',
    borderColor: '#ADB5D6',
  },
  'noble-gas': {
    key: 'noble-gas',
    label: 'Gases nobles',
    shortLabel: 'Gases nobles',
    color: '#E6DCF0', // Malva amatista
    textColor: '#462A66',
    borderColor: '#C0AED6',
  },
  'lanthanide': {
    key: 'lanthanide',
    label: 'Lantánidos',
    shortLabel: 'Lantánidos',
    color: '#F0D9E2', // Cuarzo rosa antiguo
    textColor: '#66243F',
    borderColor: '#CFA8B8',
  },
  'actinide': {
    key: 'actinide',
    label: 'Actínidos',
    shortLabel: 'Actínidos',
    color: '#E8D8EC', // Púrpura mineral
    textColor: '#522661',
    borderColor: '#C3A6CC',
  },
  'unknown': {
    key: 'unknown',
    label: 'Superpesados (predicción)',
    shortLabel: 'Superpesados',
    color: '#E8E5DC', // Piedra caliza
    textColor: '#4A473E',
    borderColor: '#C7C2B4',
  },
};

export const BLOCKS_META: Record<ElementBlock, { label: string; desc: string }> = {
  s: { label: 'Bloque s', desc: 'Orbitales s (grupos 1, 2 y He)' },
  p: { label: 'Bloque p', desc: 'Orbitales p (grupos 13 a 18)' },
  d: { label: 'Bloque d', desc: 'Orbitales d (metales de transición)' },
  f: { label: 'Bloque f', desc: 'Orbitales f (lantánidos y actínidos)' },
};

export const PHASES_META: Record<ElementPhase, { label: string; symbol: string }> = {
  solid: { label: 'Sólido', symbol: 's' },
  liquid: { label: 'Líquido', symbol: 'l' },
  gas: { label: 'Gas', symbol: 'g' },
  unknown: { label: 'Sintético / Predicción', symbol: 'sint.' },
};

/**
 * Classical CAS / Mendeleev Roman numeral group designations paired with IUPAC 1-18
 */
export const GROUP_CAS_LABELS: Record<number, string> = {
  1: 'IA',
  2: 'IIA',
  3: 'IIIB',
  4: 'IVB',
  5: 'VB',
  6: 'VIB',
  7: 'VIIB',
  8: 'VIIIB',
  9: 'VIIIB',
  10: 'VIIIB',
  11: 'IB',
  12: 'IIB',
  13: 'IIIA',
  14: 'IVA',
  15: 'VA',
  16: 'VIA',
  17: 'VIIA',
  18: 'VIIIA',
};

/**
 * Top occupied period row for each IUPAC column (1..18) for stepped group headers
 */
export const GROUP_TOP_PERIOD: Record<number, number> = {
  1: 1,
  2: 2,
  3: 4,
  4: 4,
  5: 4,
  6: 4,
  7: 4,
  8: 4,
  9: 4,
  10: 4,
  11: 4,
  12: 4,
  13: 2,
  14: 2,
  15: 2,
  16: 2,
  17: 2,
  18: 1,
};

/**
 * Calculates (x, y) 2D/3D table coordinates according to IUPAC layout
 * - Groups 1..18, Periods 1..7
 * - Lanthanides (57-71) in row 8.4, columns 3..17
 * - Actinides (89-103) in row 9.5, columns 3..17
 */
export function getElementCoordinates(elementNumber: number, period: number, group: number): { x: number; y: number } {
  // Lanthanides: 57 (La) to 71 (Lu)
  if (elementNumber >= 57 && elementNumber <= 71) {
    const col = elementNumber - 57 + 3; // columns 3 to 17
    return { x: col, y: 8.4 };
  }

  // Actinides: 89 (Ac) to 103 (Lr)
  if (elementNumber >= 89 && elementNumber <= 103) {
    const col = elementNumber - 89 + 3; // columns 3 to 17
    return { x: col, y: 9.5 };
  }

  // Normal elements
  return { x: group, y: period };
}
