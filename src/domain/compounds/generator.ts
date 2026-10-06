import type { ChemicalElement, Compound } from '../chemistry-types';
import { ElementRepository } from '../elements/element-repository';
import { balanceBinary, buildBinaryFormula, formatFormula } from './balance';
import { classifyBinaryCompound, isMetal, isNobleGas } from './classify';
import { generateBinaryNomenclature } from './nomenclature';
import { generateHydroxides, generateOxoacids, generateOxysalts } from './ternary-engine';

export interface CompoundGenerationResult {
  compounds: Compound[];
  message?: string;
  isAlloyOnly?: boolean;
  isInert?: boolean;
}

export function generateCompounds(selectedSymbols: string[]): CompoundGenerationResult {
  if (selectedSymbols.length < 2) {
    return {
      compounds: [],
      message: 'Selecciona 2 o más elementos para descubrir sus combinaciones químicas.',
    };
  }

  // Lookup elements
  const elements = selectedSymbols
    .map((s) => ElementRepository.getBySymbol(s))
    .filter((e): e is ChemicalElement => e !== undefined);

  if (elements.length < 2) {
    return { compounds: [] };
  }

  // 1. Check for Noble Gases
  const nobleGases = elements.filter(isNobleGas);
  if (nobleGases.length > 0) {
    const lightNobles = nobleGases.filter((g) => ['He', 'Ne', 'Ar'].includes(g.symbol));
    if (lightNobles.length > 0) {
      return {
        compounds: [],
        isInert: true,
        message: `Los gases nobles como ${lightNobles.map((g) => g.name).join(', ')} poseen una capa de valencia completa extremadamente estable (configuración de octeto o dueto). No forman enlaces químicos estables en condiciones normales de laboratorio.`,
      };
    }
    // Kr and Xe can form a few specific fluorides/oxides under extreme conditions
    const nonNobles = elements.filter((e) => !isNobleGas(e));
    if (nonNobles.length === 0) {
      return {
        compounds: [],
        isInert: true,
        message: 'Los gases nobles no se combinan entre sí.',
      };
    }
  }

  // 2. Check for pure metal mixture (Alloys)
  const allMetals = elements.every(isMetal);
  if (allMetals) {
    const metalNames = elements.map((m) => m.name).join(', ');
    return {
      compounds: [],
      isAlloyOnly: true,
      message: `La combinación de metales (${metalNames}) no produce compuestos estequiométricos iónicos o covalentes simples. En su lugar forman aleaciones metálicas o fases intermetálicas unidas mediante enlace metálico (mar de electrones deslocalizados).`,
    };
  }

  const compoundMap = new Map<string, Compound>();

  // 3. Generate Binary Compounds for all pairs in selection
  for (let i = 0; i < elements.length; i++) {
    for (let j = i + 1; j < elements.length; j++) {
      const elA = elements[i];
      const elB = elements[j];

      if (isNobleGas(elA) || isNobleGas(elB)) continue;
      if (isMetal(elA) && isMetal(elB)) continue;

      // Determine Cation (less electronegative) vs Anion (more electronegative)
      const enA = elA.electronegativity ?? (isMetal(elA) ? 1.0 : 2.5);
      const enB = elB.electronegativity ?? (isMetal(elB) ? 1.0 : 2.5);

      let cationEl: ChemicalElement;
      let anionEl: ChemicalElement;

      if (enA <= enB) {
        cationEl = elA;
        anionEl = elB;
      } else {
        cationEl = elB;
        anionEl = elA;
      }

      // Cation needs positive oxidation states, Anion needs negative oxidation states
      let positiveStates = cationEl.oxidationStates.filter((s) => s > 0);
      let negativeStates = anionEl.oxidationStates.filter((s) => s < 0);

      // Special case: H can be -1 with active metals (hydride) or +1 with nonmetals
      if (anionEl.symbol === 'H' && isMetal(cationEl)) {
        negativeStates = [-1];
      }
      if (cationEl.symbol === 'H') {
        positiveStates = [1];
      }
      // For oxygen in standard binary oxides, oxidation state is strictly -2 (peroxides handled separately)
      if (anionEl.symbol === 'O') {
        negativeStates = [-2];
      }

      // If no standard negative states for anion (e.g. some metalloids), fallback to group normal valency
      if (negativeStates.length === 0) {
        if (anionEl.group === 17) negativeStates = [-1];
        else if (anionEl.group === 16) negativeStates = [-2];
        else if (anionEl.group === 15) negativeStates = [-3];
        else if (anionEl.group === 14) negativeStates = [-4];
      }

      for (const catOx of positiveStates) {
        for (const anOx of negativeStates) {
          const { cationSubscript, anionSubscript } = balanceBinary(catOx, anOx);
          const rawFormula = buildBinaryFormula(
            cationEl.symbol,
            cationSubscript,
            anionEl.symbol,
            anionSubscript
          );

          const classification = classifyBinaryCompound(cationEl, anionEl, rawFormula);
          const nomenclature = generateBinaryNomenclature(
            cationEl,
            cationSubscript,
            catOx,
            anionEl,
            anionSubscript
          );

          const id = `${cationEl.symbol}${cationSubscript}-${anionEl.symbol}${anionSubscript}-${catOx}`;

          if (!compoundMap.has(rawFormula)) {
            compoundMap.set(rawFormula, {
              id,
              formula: rawFormula,
              formulaFormatted: formatFormula(rawFormula),
              elements: [cationEl.symbol, anionEl.symbol],
              nomenclature,
              type: classification.type,
              typeLabel: classification.typeLabel,
              bondType: classification.bondType,
              description: classification.description,
              isTheoretical: false,
              stoichiometry: {
                [cationEl.symbol]: cationSubscript,
                [anionEl.symbol]: anionSubscript,
              },
            });
          }
        }
      }

      // Canonical formulas for nonmetal hydrides: NH3 and CH4
      if ((elA.symbol === 'N' && elB.symbol === 'H') || (elA.symbol === 'H' && elB.symbol === 'N')) {
        compoundMap.delete('H3N');
        compoundMap.set('NH3', {
          id: 'NH3-ammonia',
          formula: 'NH3',
          formulaFormatted: formatFormula('NH3'),
          elements: ['N', 'H'],
          nomenclature: {
            systematic: 'trihidruro de nitrógeno',
            stock: 'hidruro de nitrógeno(III)',
            traditional: 'amoníaco',
            common: 'amoníaco',
          },
          type: 'covalente',
          typeLabel: 'Hidruro no metálico',
          bondType: 'covalente',
          description: 'Compuesto gaseoso incoloro con olor punzante característico. Clave en la síntesis industrial de fertilizantes (proceso Haber-Bosch).',
          isTheoretical: false,
          stoichiometry: { N: 1, H: 3 },
        });
      }

      if ((elA.symbol === 'C' && elB.symbol === 'H') || (elA.symbol === 'H' && elB.symbol === 'C')) {
        compoundMap.delete('H4C');
        compoundMap.set('CH4', {
          id: 'CH4-methane',
          formula: 'CH4',
          formulaFormatted: formatFormula('CH4'),
          elements: ['C', 'H'],
          nomenclature: {
            systematic: 'tetrahidruro de carbono',
            stock: 'hidruro de carbono(IV)',
            traditional: 'metano',
            common: 'metano',
          },
          type: 'covalente',
          typeLabel: 'Hidruro no metálico (hidrocarburo)',
          bondType: 'covalente',
          description: 'Hidrocarburo alcano más simple y componente principal del gas natural. Combustible fósil limpio y gas de efecto invernadero.',
          isTheoretical: false,
          stoichiometry: { C: 1, H: 4 },
        });
      }

      // Special known case: Hydrogen Peroxide (H2O2)
      if (
        (elA.symbol === 'H' && elB.symbol === 'O') ||
        (elA.symbol === 'O' && elB.symbol === 'H')
      ) {
        compoundMap.set('H2O2', {
          id: 'H2O2-peroxide',
          formula: 'H2O2',
          formulaFormatted: formatFormula('H2O2'),
          elements: ['H', 'O'],
          nomenclature: {
            systematic: 'dióxido de dihidrógeno',
            stock: 'peróxido de hidrógeno',
            traditional: 'peróxido de hidrógeno',
            common: 'agua oxigenada',
          },
          type: 'peroxido',
          typeLabel: 'Peróxido',
          bondType: 'covalente',
          description: 'Compuesto que contiene el enlace peroxo (O-O con número de oxidación -1). Potente oxidante y desinfectante.',
          isTheoretical: false,
          stoichiometry: { H: 2, O: 2 },
        });
      }
    }
  }

  // 4. Generate Ternary Compounds (if 3 or more elements, or combinations containing H, O and another element)
  const symbols = new Set(elements.map((e) => e.symbol));

  // Hydroxides: Metal + O + H
  if (symbols.has('O') && symbols.has('H')) {
    const metals = elements.filter(isMetal);
    for (const m of metals) {
      const hydroxides = generateHydroxides(m);
      for (const h of hydroxides) {
        if (!compoundMap.has(h.formula)) {
          compoundMap.set(h.formula, h);
        }
      }
    }
  }

  // Oxoacids: H + Nonmetal + O
  if (symbols.has('H') && symbols.has('O')) {
    const nonmetals = elements.filter((e) => !isMetal(e) && e.symbol !== 'H' && e.symbol !== 'O');
    for (const nm of nonmetals) {
      const oxoacids = generateOxoacids(nm.symbol);
      for (const acid of oxoacids) {
        if (!compoundMap.has(acid.formula)) {
          compoundMap.set(acid.formula, acid);
        }
      }
    }
  }

  // Oxysalts: Metal + Nonmetal + O
  if (symbols.has('O')) {
    const metals = elements.filter(isMetal);
    const nonmetals = elements.filter((e) => !isMetal(e) && e.symbol !== 'H' && e.symbol !== 'O');
    for (const m of metals) {
      for (const nm of nonmetals) {
        const oxysalts = generateOxysalts(m, nm.symbol);
        for (const salt of oxysalts) {
          if (!compoundMap.has(salt.formula)) {
            compoundMap.set(salt.formula, salt);
          }
        }
      }
    }
  }

  const allCompounds = Array.from(compoundMap.values());

  // Priority sorting:
  // 1. Oxides, Hydroxides, Acids, Oxysalts, Binary salts, Covalents
  const typeOrder: Record<string, number> = {
    'oxido-basico': 1,
    'oxido-acido': 2,
    'hidroxido': 3,
    'oxoacido': 4,
    'oxisal': 5,
    'sal-binaria': 6,
    'hidracido': 7,
    'hidruro-metalico': 8,
    'peroxido': 9,
    'covalente': 10,
    'otro': 11,
  };

  allCompounds.sort((a, b) => {
    const orderA = typeOrder[a.type] ?? 99;
    const orderB = typeOrder[b.type] ?? 99;
    if (orderA !== orderB) return orderA - orderB;
    return a.formula.localeCompare(b.formula);
  });

  return {
    compounds: allCompounds,
  };
}
