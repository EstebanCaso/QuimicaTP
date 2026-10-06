import type { ChemicalElement, CompoundNomenclature } from '../chemistry-types';

export const GREEK_PREFIXES: Record<number, string> = {
  1: 'mono',
  2: 'di',
  3: 'tri',
  4: 'tetra',
  5: 'penta',
  6: 'hexa',
  7: 'hepta',
  8: 'octa',
  9: 'nona',
  10: 'deca',
  11: 'undeca',
  12: 'dodeca',
};

export const ROMAN_NUMERALS: Record<number, string> = {
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
  5: 'V',
  6: 'VI',
  7: 'VII',
  8: 'VIII',
};

// Root names for traditional Latin naming
export const TRADITIONAL_ROOTS: Record<string, string> = {
  Fe: 'ferr',
  Cu: 'cupr',
  Au: 'aur',
  Ag: 'argent',
  Pb: 'plumb',
  Sn: 'estann',
  S: 'sulfur',
  N: 'nitr',
  P: 'fosfor',
  C: 'carbon',
  Cl: 'clor',
  Br: 'brom',
  I: 'yod',
  F: 'fluor',
};

// Negative anion names
export const ANION_ROOTS: Record<string, string> = {
  O: 'óxido',
  H: 'hidruro',
  F: 'fluoruro',
  Cl: 'cloruro',
  Br: 'bromuro',
  I: 'yoduro',
  S: 'sulfuro',
  Se: 'seleniuro',
  Te: 'telururo',
  N: 'nitruro',
  P: 'fosfuro',
  As: 'arseniuro',
  C: 'carburo',
  Si: 'siliciuro',
  B: 'boruro',
};

export const HYDRACID_NAMES: Record<string, string> = {
  F: 'ácido fluorhídrico',
  Cl: 'ácido clorhídrico',
  Br: 'ácido bromhídrico',
  I: 'ácido yodhídrico',
  S: 'ácido sulfhídrico',
  Se: 'ácido selenhídrico',
  Te: 'ácido telurhídrico',
};

export function getPrefix(n: number): string {
  const p = GREEK_PREFIXES[n] || '';
  if (!p) return '';
  // "monóxido" instead of "monoóxido"
  return p;
}

export function formatPrefixRoot(prefix: string, root: string): string {
  if (prefix === 'mono' && root === 'óxido') return 'monóxido';
  if (prefix === 'tetra' && root === 'óxido') return 'tetróxido';
  if (prefix === 'penta' && root === 'óxido') return 'pentóxido';
  if (prefix === 'hepta' && root === 'óxido') return 'heptóxido';
  return `${prefix}${root}`;
}

/**
 * Returns traditional suffix/prefix for cation oxidation state
 */
export function getTraditionalAffix(
  _cationSymbol: string,
  state: number,
  allStates: number[]
): { prefix: string; suffix: string } {
  // Sort positive states
  const positiveStates = allStates.filter((s) => s > 0).sort((a, b) => a - b);
  const count = positiveStates.length;
  const idx = positiveStates.indexOf(state);

  if (count <= 1 || idx === -1) {
    return { prefix: '', suffix: 'ico' };
  }

  if (count === 2) {
    return idx === 0 ? { prefix: '', suffix: 'oso' } : { prefix: '', suffix: 'ico' };
  }

  if (count === 3) {
    if (idx === 0) return { prefix: 'hipo', suffix: 'oso' };
    if (idx === 1) return { prefix: '', suffix: 'oso' };
    return { prefix: '', suffix: 'ico' };
  }

  // 4 states (like halogens: +1, +3, +5, +7)
  if (idx === 0) return { prefix: 'hipo', suffix: 'oso' };
  if (idx === 1) return { prefix: '', suffix: 'oso' };
  if (idx === 2) return { prefix: '', suffix: 'ico' };
  return { prefix: 'per', suffix: 'ico' };
}

/**
 * Creates Traditional cation adjective (e.g., ferroso, férrico, sódico)
 */
export function getTraditionalCationAdjective(
  cation: ChemicalElement,
  state: number
): string {
  const positiveStates = cation.oxidationStates.filter((s) => s > 0);
  if (positiveStates.length <= 1) {
    // Only 1 positive state: often "de [nombre]" or "[raíz]ico"
    return `de ${cation.name.toLowerCase()}`;
  }

  const root = TRADITIONAL_ROOTS[cation.symbol] || cation.name.toLowerCase().replace(/[oa]$/, '');
  const { prefix, suffix } = getTraditionalAffix(cation.symbol, state, cation.oxidationStates);

  // Special acoustic adjustments in Spanish
  let combined = `${prefix}${root}${suffix}`;
  if (combined === 'ferrico') combined = 'férrico';
  if (combined === 'aurico') combined = 'áurico';
  if (combined === 'estannico') combined = 'estánnico';
  if (combined === 'plumbico') combined = 'plúmbico';
  if (combined === 'sulfurico') combined = 'sulfúrico';
  if (combined === 'fosforico') combined = 'fosfórico';
  if (combined === 'carbonico') combined = 'carbónico';
  if (combined === 'nitrico') combined = 'nítrico';
  if (combined === 'clorico') combined = 'clórico';
  if (combined === 'bromico') combined = 'brómico';
  if (combined === 'yodico') combined = 'yódico';

  return combined;
}

export function generateBinaryNomenclature(
  cation: ChemicalElement,
  cationSub: number,
  cationOxState: number,
  anion: ChemicalElement,
  anionSub: number
): CompoundNomenclature {
  const anionWord = ANION_ROOTS[anion.symbol] || `${anion.name.toLowerCase()}uro`;

  // 1. Systematic (IUPAC prefixes)
  const anPref = getPrefix(anionSub);
  const catPref = cationSub > 1 ? getPrefix(cationSub) : '';

  const firstPart = anPref ? formatPrefixRoot(anPref, anionWord) : anionWord;
  const secondPart = catPref
    ? `${catPref}${cation.name.toLowerCase()}`
    : cation.name.toLowerCase();

  const systematic = `${firstPart} de ${secondPart}`;

  // 2. Stock Nomenclature
  const positiveStates = cation.oxidationStates.filter((s) => s > 0);
  const needsRoman = positiveStates.length > 1;
  const roman = needsRoman && ROMAN_NUMERALS[cationOxState] ? `(${ROMAN_NUMERALS[cationOxState]})` : '';
  const stock = `${anionWord} de ${cation.name.toLowerCase()}${roman ? ' ' + roman : ''}`;

  // 3. Traditional Nomenclature
  let traditional = '';
  // Check special cases like water, ammonia, methane, hydracids
  if (cation.symbol === 'H') {
    if (anion.symbol === 'O') {
      return {
        systematic: 'monóxido de dihidrógeno',
        stock: 'óxido de hidrógeno',
        traditional: 'agua',
        common: 'agua',
      };
    }
    if (HYDRACID_NAMES[anion.symbol]) {
      return {
        systematic,
        stock,
        traditional: HYDRACID_NAMES[anion.symbol],
        common: HYDRACID_NAMES[anion.symbol],
      };
    }
  }

  if (anion.symbol === 'H') {
    if (cation.symbol === 'N' && cationSub === 1 && anionSub === 3) {
      return {
        systematic: 'trihidruro de nitrógeno',
        stock: 'hidruro de nitrógeno(III)',
        traditional: 'amoníaco',
        common: 'amoníaco',
      };
    }
    if (cation.symbol === 'C' && cationSub === 1 && anionSub === 4) {
      return {
        systematic: 'tetrahidruro de carbono',
        stock: 'hidruro de carbono(IV)',
        traditional: 'metano',
        common: 'metano',
      };
    }
  }

  // Nonmetal + Oxygen = Anhydride in traditional
  if (anion.symbol === 'O' && cation.category !== 'alkali-metal' && cation.category !== 'alkaline-earth-metal' && cation.category !== 'transition-metal') {
    const adj = getTraditionalCationAdjective(cation, cationOxState);
    if (adj.startsWith('de ')) {
      traditional = `anhídrido ${adj}`;
    } else {
      traditional = `anhídrido ${adj}`;
    }
  } else {
    const adj = getTraditionalCationAdjective(cation, cationOxState);
    if (adj.startsWith('de ')) {
      traditional = `${anionWord} ${adj}`;
    } else {
      traditional = `${anionWord} ${adj}`;
    }
  }

  return {
    systematic,
    stock,
    traditional,
  };
}
