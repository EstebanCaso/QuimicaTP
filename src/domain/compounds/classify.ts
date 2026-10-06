import type { ChemicalElement, CompoundType, BondType } from '../chemistry-types';

export function isMetal(el: ChemicalElement): boolean {
  return [
    'alkali-metal',
    'alkaline-earth-metal',
    'transition-metal',
    'post-transition-metal',
    'lanthanide',
    'actinide',
  ].includes(el.category);
}

export function isNonmetal(el: ChemicalElement): boolean {
  return ['reactive-nonmetal', 'halogen'].includes(el.category);
}

export function isNobleGas(el: ChemicalElement): boolean {
  return el.category === 'noble-gas';
}

export function isMetalloid(el: ChemicalElement): boolean {
  return el.category === 'metalloid';
}

export interface ClassificationResult {
  type: CompoundType;
  typeLabel: string;
  bondType: BondType;
  description: string;
}

export function classifyBinaryCompound(
  cationEl: ChemicalElement,
  anionEl: ChemicalElement,
  formula: string
): ClassificationResult {
  const catIsMetal = isMetal(cationEl);
  const anIsMetal = isMetal(anionEl);

  // Metal + Metal = Intermetallic / Alloy
  if (catIsMetal && anIsMetal) {
    return {
      type: 'intermetalico',
      typeLabel: 'Compuesto intermetálico / Aleación',
      bondType: 'intermetalico',
      description: 'Combinación metálica. No forma una sal o molécula estequiométrica simple en condiciones ordinarias, sino soluciones sólidas o fases intermetálicas con enlace metálico.',
    };
  }

  // Bond type determination
  const bondType: BondType = catIsMetal ? 'ionico' : 'covalente';

  // Oxygen compounds
  if (anionEl.symbol === 'O') {
    if (formula === 'H2O2' || formula === 'Na2O2' || formula === 'BaO2') {
      return {
        type: 'peroxido',
        typeLabel: 'Peróxido',
        bondType,
        description: 'Compuesto que contiene el enlace oxígeno-oxígeno puente (grupo peroxo con oxígeno en estado de oxidación -1).',
      };
    }
    if (catIsMetal) {
      return {
        type: 'oxido-basico',
        typeLabel: 'Óxido básico',
        bondType: 'ionico',
        description: 'Combinación de un metal con el oxígeno. Al reaccionar con agua forma típicamente hidróxidos o bases.',
      };
    } else {
      return {
        type: 'oxido-acido',
        typeLabel: 'Óxido ácido (anhídrido)',
        bondType: 'covalente',
        description: 'Combinación de un no metal o metaloide con el oxígeno. Al combinarse con agua genera oxoácidos.',
      };
    }
  }

  // Hydrogen compounds
  if (anionEl.symbol === 'H') {
    if (catIsMetal) {
      return {
        type: 'hidruro-metalico',
        typeLabel: 'Hidruro metálico',
        bondType: 'ionico',
        description: 'Compuesto formado por un catión metálico y el ion hidruro (H⁻). Actúa a menudo como agente reductor vigoroso.',
      };
    } else {
      return {
        type: 'covalente',
        typeLabel: 'Hidruro no metálico (compuesto molecular)',
        bondType: 'covalente',
        description: 'Combinación covalente de hidrógeno con un no metal de los grupos 13, 14 o 15 (como nitrógeno, carbono o boro).',
      };
    }
  }

  // Hydrogen as cation (Acid Hydracids)
  if (cationEl.symbol === 'H') {
    const hydracidAnions = ['F', 'Cl', 'Br', 'I', 'S', 'Se', 'Te'];
    if (hydracidAnions.includes(anionEl.symbol)) {
      return {
        type: 'hidracido',
        typeLabel: 'Hidrácido (hidruro ácido)',
        bondType: 'covalente',
        description: 'Compuesto binario de hidrógeno con un halógeno o anfígeno. En disolución acuosa libera protones comportándose como ácido fuerte o moderado.',
      };
    }
  }

  // Metal + Nonmetal (Binary Salt)
  if (catIsMetal && (isNonmetal(anionEl) || isMetalloid(anionEl))) {
    return {
      type: 'sal-binaria',
      typeLabel: 'Sal binaria',
      bondType: 'ionico',
      description: 'Sal neutra formada por atracción electrostática entre un catión metálico y un anión no metálico simple.',
    };
  }

  // Nonmetal + Nonmetal
  return {
    type: 'covalente',
    typeLabel: 'Compuesto molecular covalente',
    bondType: 'covalente',
    description: 'Enlace covalente con compartición de pares electrónicos entre dos no metales con electronegatividades comparables.',
  };
}

export function classifyTernaryCompound(
  compoundType: 'hidroxido' | 'oxoacido' | 'oxisal'
): ClassificationResult {
  switch (compoundType) {
    case 'hidroxido':
      return {
        type: 'hidroxido',
        typeLabel: 'Hidróxido (base)',
        bondType: 'ionico',
        description: 'Compuesto ternario constituido por un catión metálico y aniones hidróxido (OH⁻). Proporciona propiedades básicas en disolución acuosa.',
      };
    case 'oxoacido':
      return {
        type: 'oxoacido',
        typeLabel: 'Oxoácido',
        bondType: 'covalente',
        description: 'Compuesto ternario formado por hidrógeno, un no metal central y oxígeno. Libera protones (H⁺) en medio acuoso.',
      };
    case 'oxisal':
      return {
        type: 'oxisal',
        typeLabel: 'Oxisal neutra',
        bondType: 'ionico',
        description: 'Sal ternaria derivada de la sustitución total de los hidrógenos de un oxoácido por cationes metálicos.',
      };
  }
}
