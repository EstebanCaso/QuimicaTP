export const SHELL_LETTERS = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];

export interface ShellDetail {
  shellNumber: number; // 1, 2, 3...
  letter: string; // K, L, M...
  electrons: number;
  maxElectrons: number;
}

export function parseShellDetails(shells: number[]): ShellDetail[] {
  return shells.map((count, index) => {
    const n = index + 1;
    const maxElectrons = 2 * n * n;
    return {
      shellNumber: n,
      letter: SHELL_LETTERS[index] || `N${n}`,
      electrons: count,
      maxElectrons,
    };
  });
}

/**
 * Returns formatted orbital notation HTML, e.g. "1s² 2s² 2p⁶"
 */
export function formatElectronConfig(configStr: string): string {
  return configStr.replace(/(\d+)([spdf])(\d+)/g, '$1$2<sup>$3</sup>');
}
