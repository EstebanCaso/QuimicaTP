import type { ElementCategory, ElementBlock, ElementPhase } from '../chemistry-types';

export interface CategoryMeta {
  key: ElementCategory;
  label: string;
  color: string; // Pastel background hex
  textColor: string;
  borderColor: string;
}

export const CATEGORIES_META: Record<ElementCategory, CategoryMeta> = {
  'alkali-metal': {
    key: 'alkali-metal',
    label: 'Metales alcalinos',
    color: '#FEE2E2', // soft red
    textColor: '#991B1B',
    borderColor: '#FECACA',
  },
  'alkaline-earth-metal': {
    key: 'alkaline-earth-metal',
    label: 'Alcalinotérreos',
    color: '#FFEDD5', // soft orange
    textColor: '#9A3412',
    borderColor: '#FED7AA',
  },
  'transition-metal': {
    key: 'transition-metal',
    label: 'Metales de transición',
    color: '#E2E8F0', // soft slate
    textColor: '#334155',
    borderColor: '#CBD5E1',
  },
  'post-transition-metal': {
    key: 'post-transition-metal',
    label: 'Metales post-transición',
    color: '#DCFCE7', // soft green
    textColor: '#166534',
    borderColor: '#BBF7D0',
  },
  'metalloid': {
    key: 'metalloid',
    label: 'Metaloides',
    color: '#FEF9C3', // soft yellow
    textColor: '#854D0E',
    borderColor: '#FEF08A',
  },
  'reactive-nonmetal': {
    key: 'reactive-nonmetal',
    label: 'No metales reactivos',
    color: '#E0F2FE', // soft sky
    textColor: '#075985',
    borderColor: '#BAE6FD',
  },
  'halogen': {
    key: 'halogen',
    label: 'Halógenos',
    color: '#E0E7FF', // soft indigo
    textColor: '#3730A3',
    borderColor: '#C7D2FE',
  },
  'noble-gas': {
    key: 'noble-gas',
    label: 'Gases nobles',
    color: '#EDE9FE', // soft purple
    textColor: '#581C87',
    borderColor: '#DDD6FE',
  },
  'lanthanide': {
    key: 'lanthanide',
    label: 'Lantánidos',
    color: '#FCE7F3', // soft pink
    textColor: '#9D174D',
    borderColor: '#FBCFE8',
  },
  'actinide': {
    key: 'actinide',
    label: 'Actínidos',
    color: '#F3E8FF', // soft fuchsia
    textColor: '#6B21A8',
    borderColor: '#E9D5FF',
  },
  'unknown': {
    key: 'unknown',
    label: 'Superpesados (predicción)',
    color: '#F4F4F5', // zinc neutral
    textColor: '#52525B',
    borderColor: '#E4E4E7',
  },
};

export const BLOCKS_META: Record<ElementBlock, { label: string; desc: string }> = {
  s: { label: 'Bloque s', desc: 'Orbitales s (grupos 1, 2 y He)' },
  p: { label: 'Bloque p', desc: 'Orbitales p (grupos 13 a 18)' },
  d: { label: 'Bloque d', desc: 'Orbitales d (metales de transición)' },
  f: { label: 'Bloque f', desc: 'Orbitales f (lantánidos y actínidos)' },
};

export const PHASES_META: Record<ElementPhase, { label: string }> = {
  solid: { label: 'Sólido' },
  liquid: { label: 'Líquido' },
  gas: { label: 'Gas' },
  unknown: { label: 'Sintético / Desconocido' },
};

/**
 * Calculates (x, y) 2D/3D table coordinates according to IUPAC layout
 * - Groups 1..18, Periods 1..7
 * - Lanthanides (57-71) in row 8.5, columns 3..17
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
