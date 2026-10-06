import type { ChemicalElement, Compound } from '../chemistry-types';
import { formatFormula, gcd } from './balance';
import { ROMAN_NUMERALS, getPrefix, getTraditionalCationAdjective } from './nomenclature';
import { classifyTernaryCompound, isMetal } from './classify';

export interface TernaryPattern {
  name: string; // e.g. "sulfato"
  formulaSuffix: string; // "SO4"
  anionCharge: number; // -2
  nonmetalSymbol: string; // "S"
  sysAcid: string; // "tetraoxosulfato"
  tradAcid: string; // "ácido sulfúrico"
  tradSalt: string; // "sulfato"
  elements: string[]; // ["S", "O"]
}

const COMMON_OXYANIONS: TernaryPattern[] = [
  // Sulfur
  { name: 'sulfato', formulaSuffix: 'SO4', anionCharge: -2, nonmetalSymbol: 'S', sysAcid: 'tetraoxosulfato', tradAcid: 'ácido sulfúrico', tradSalt: 'sulfato', elements: ['S', 'O'] },
  { name: 'sulfito', formulaSuffix: 'SO3', anionCharge: -2, nonmetalSymbol: 'S', sysAcid: 'trioxosulfato', tradAcid: 'ácido sulfuroso', tradSalt: 'sulfito', elements: ['S', 'O'] },
  // Nitrogen
  { name: 'nitrato', formulaSuffix: 'NO3', anionCharge: -1, nonmetalSymbol: 'N', sysAcid: 'trioxonitrato', tradAcid: 'ácido nítrico', tradSalt: 'nitrato', elements: ['N', 'O'] },
  { name: 'nitrito', formulaSuffix: 'NO2', anionCharge: -1, nonmetalSymbol: 'N', sysAcid: 'dioxonitrato', tradAcid: 'ácido nitroso', tradSalt: 'nitrito', elements: ['N', 'O'] },
  // Carbon
  { name: 'carbonato', formulaSuffix: 'CO3', anionCharge: -2, nonmetalSymbol: 'C', sysAcid: 'trioxocarbonato', tradAcid: 'ácido carbónico', tradSalt: 'carbonato', elements: ['C', 'O'] },
  // Phosphorus
  { name: 'fosfato', formulaSuffix: 'PO4', anionCharge: -3, nonmetalSymbol: 'P', sysAcid: 'tetraoxofosfato', tradAcid: 'ácido fosfórico', tradSalt: 'fosfato', elements: ['P', 'O'] },
  // Chlorine
  { name: 'hipoclorito', formulaSuffix: 'ClO', anionCharge: -1, nonmetalSymbol: 'Cl', sysAcid: 'monoxoclorato', tradAcid: 'ácido hipocloroso', tradSalt: 'hipoclorito', elements: ['Cl', 'O'] },
  { name: 'clorito', formulaSuffix: 'ClO2', anionCharge: -1, nonmetalSymbol: 'Cl', sysAcid: 'dioxoclorato', tradAcid: 'ácido cloroso', tradSalt: 'clorito', elements: ['Cl', 'O'] },
  { name: 'clorato', formulaSuffix: 'ClO3', anionCharge: -1, nonmetalSymbol: 'Cl', sysAcid: 'trioxoclorato', tradAcid: 'ácido clórico', tradSalt: 'clorato', elements: ['Cl', 'O'] },
  { name: 'perclorato', formulaSuffix: 'ClO4', anionCharge: -1, nonmetalSymbol: 'Cl', sysAcid: 'tetraoxoclorato', tradAcid: 'ácido perclórico', tradSalt: 'perclorato', elements: ['Cl', 'O'] },
];

export function generateHydroxides(metal: ChemicalElement): Compound[] {
  if (!isMetal(metal)) return [];
  const results: Compound[] = [];
  const positiveStates = metal.oxidationStates.filter((s) => s > 0);

  for (const ox of positiveStates) {
    const rawFormula = ox === 1 ? `${metal.symbol}OH` : `${metal.symbol}(OH)${ox}`;
    const classification = classifyTernaryCompound('hidroxido');

    // Systematic
    const pref = getPrefix(ox);
    const systematic = ox === 1
      ? `hidróxido de ${metal.name.toLowerCase()}`
      : `${pref}hidróxido de ${metal.name.toLowerCase()}`;

    // Stock
    const needsRoman = positiveStates.length > 1;
    const roman = needsRoman && ROMAN_NUMERALS[ox] ? ` (${ROMAN_NUMERALS[ox]})` : '';
    const stock = `hidróxido de ${metal.name.toLowerCase()}${roman}`;

    // Traditional
    const adj = getTraditionalCationAdjective(metal, ox);
    const traditional = `hidróxido ${adj}`;

    results.push({
      id: `${metal.symbol}-OH-${ox}`,
      formula: rawFormula,
      formulaFormatted: formatFormula(rawFormula),
      elements: [metal.symbol, 'O', 'H'],
      nomenclature: {
        systematic,
        stock,
        traditional,
      },
      type: classification.type,
      typeLabel: classification.typeLabel,
      bondType: classification.bondType,
      description: `Hidróxido formado por la combinación del catión metálico ${metal.symbol}⁺${ox === 1 ? '' : ox} con iones oxidrilo/hidróxido (OH⁻).`,
      isTheoretical: false,
      stoichiometry: {
        [metal.symbol]: 1,
        O: ox,
        H: ox,
      },
    });
  }

  return results;
}

export function generateOxoacids(nonmetalSymbol: string): Compound[] {
  const matchingPatterns = COMMON_OXYANIONS.filter((p) => p.nonmetalSymbol === nonmetalSymbol);
  const results: Compound[] = [];

  for (const pat of matchingPatterns) {
    const hSub = Math.abs(pat.anionCharge);
    const hPart = hSub > 1 ? `H${hSub}` : 'H';
    const rawFormula = `${hPart}${pat.formulaSuffix}`;
    const classification = classifyTernaryCompound('oxoacido');

    const hPrefix = hSub > 1 ? `de ${getPrefix(hSub)}hidrógeno` : 'de hidrógeno';
    const systematic = `${pat.sysAcid} ${hPrefix}`;
    const stock = `${pat.tradAcid}`;
    const traditional = pat.tradAcid;

    results.push({
      id: `H-${pat.formulaSuffix}`,
      formula: rawFormula,
      formulaFormatted: formatFormula(rawFormula),
      elements: ['H', nonmetalSymbol, 'O'],
      nomenclature: {
        systematic,
        stock,
        traditional,
      },
      type: classification.type,
      typeLabel: classification.typeLabel,
      bondType: classification.bondType,
      description: `Oxoácido clásico formado por la hidratación de un anhídrido de ${nonmetalSymbol}. Desprende protones en disolución acuosa.`,
      isTheoretical: false,
      stoichiometry: {
        H: hSub,
        [nonmetalSymbol]: 1,
        O: parseInt(pat.formulaSuffix.replace(/\D/g, ''), 10) || 1,
      },
    });
  }

  return results;
}

export function generateOxysalts(metal: ChemicalElement, nonmetalSymbol: string): Compound[] {
  if (!isMetal(metal)) return [];
  const matchingPatterns = COMMON_OXYANIONS.filter((p) => p.nonmetalSymbol === nonmetalSymbol);
  const results: Compound[] = [];
  const positiveStates = metal.oxidationStates.filter((s) => s > 0);

  for (const pat of matchingPatterns) {
    const anionCharge = Math.abs(pat.anionCharge);

    for (const metalOx of positiveStates) {
      const divisor = gcd(metalOx, anionCharge);
      const catSub = anionCharge / divisor;
      const anSub = metalOx / divisor;

      let rawFormula = '';
      const catPart = catSub > 1 ? `${metal.symbol}${catSub}` : metal.symbol;
      if (anSub === 1) {
        rawFormula = `${catPart}${pat.formulaSuffix}`;
      } else {
        rawFormula = `${catPart}(${pat.formulaSuffix})${anSub}`;
      }

      const classification = classifyTernaryCompound('oxisal');

      // Systematic
      const catPref = catSub > 1 ? getPrefix(catSub) : '';
      const catWord = catPref ? `${catPref}${metal.name.toLowerCase()}` : metal.name.toLowerCase();
      const systematic = `${pat.sysAcid} de ${catWord}`;

      // Stock
      const needsRoman = positiveStates.length > 1;
      const roman = needsRoman && ROMAN_NUMERALS[metalOx] ? ` (${ROMAN_NUMERALS[metalOx]})` : '';
      const stock = `${pat.tradSalt} de ${metal.name.toLowerCase()}${roman}`;

      // Traditional
      const adj = getTraditionalCationAdjective(metal, metalOx);
      const traditional = `${pat.tradSalt} ${adj}`;

      results.push({
        id: `${metal.symbol}-${pat.formulaSuffix}-${metalOx}`,
        formula: rawFormula,
        formulaFormatted: formatFormula(rawFormula),
        elements: [metal.symbol, nonmetalSymbol, 'O'],
        nomenclature: {
          systematic,
          stock,
          traditional,
        },
        type: classification.type,
        typeLabel: classification.typeLabel,
        bondType: classification.bondType,
        description: `Oxisal neutra resultante de la neutralización del anión ${pat.name} con cationes de ${metal.name}.`,
        isTheoretical: false,
        stoichiometry: {
          [metal.symbol]: catSub,
          [nonmetalSymbol]: anSub,
          O: anSub * (parseInt(pat.formulaSuffix.replace(/\D/g, ''), 10) || 1),
        },
      });
    }
  }

  return results;
}
