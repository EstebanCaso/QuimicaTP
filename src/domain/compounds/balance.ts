export function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

const SUBSCRIPT_MAP: Record<string, string> = {
  '0': '₀',
  '1': '₁',
  '2': '₂',
  '3': '₃',
  '4': '₄',
  '5': '₅',
  '6': '₆',
  '7': '₇',
  '8': '₈',
  '9': '₉',
  '+': '⁺',
  '-': '⁻',
};

export function toSubscript(num: number | string): string {
  const str = num.toString();
  return str
    .split('')
    .map((c) => SUBSCRIPT_MAP[c] || c)
    .join('');
}

export function formatFormula(formula: string): string {
  // Replace digits immediately following element symbols or parentheses with Unicode subscripts
  return formula.replace(/([A-Za-z)\]])(\d+)/g, (_, prefix, num) => {
    return prefix + toSubscript(num);
  });
}

export interface BalancedBinaryRatio {
  cationSubscript: number;
  anionSubscript: number;
}

/**
 * Balances cation and anion charges using lowest common multiple and GCD reduction
 * @param cationValence Positive oxidation state, e.g. +3 for Fe3+
 * @param anionValence Negative oxidation state, e.g. -2 for O2-
 */
export function balanceBinary(cationValence: number, anionValence: number): BalancedBinaryRatio {
  const cat = Math.abs(cationValence);
  const an = Math.abs(anionValence);

  if (cat === 0 || an === 0) {
    return { cationSubscript: 1, anionSubscript: 1 };
  }

  const divisor = gcd(cat, an);
  return {
    cationSubscript: an / divisor,
    anionSubscript: cat / divisor,
  };
}

/**
 * Constructs raw formula from cation and anion symbols and subscripts
 */
export function buildBinaryFormula(
  catSymbol: string,
  catSub: number,
  anSymbol: string,
  anSub: number
): string {
  const catPart = catSub > 1 ? `${catSymbol}${catSub}` : catSymbol;
  const anPart = anSub > 1 ? `${anSymbol}${anSub}` : anSymbol;
  return `${catPart}${anPart}`;
}
