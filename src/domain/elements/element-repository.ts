import elementsData from '../../data/elements.json';
import historyData from '../../data/history.json';
import type { ChemicalElement, SuperheavyHistory, ElementCategory, ElementBlock, ElementPhase } from '../chemistry-types';

const elements: ChemicalElement[] = elementsData as ChemicalElement[];
const histories: SuperheavyHistory[] = historyData as SuperheavyHistory[];

const elementMapByNumber = new Map<number, ChemicalElement>();
const elementMapBySymbol = new Map<string, ChemicalElement>();
const historyMap = new Map<number, SuperheavyHistory>();

for (const el of elements) {
  elementMapByNumber.set(el.number, el);
  elementMapBySymbol.set(el.symbol, el);
}

for (const h of histories) {
  historyMap.set(h.elementNumber, h);
}

export const ElementRepository = {
  getAllElements(): ChemicalElement[] {
    return elements;
  },

  getByNumber(num: number): ChemicalElement | undefined {
    return elementMapByNumber.get(num);
  },

  getBySymbol(symbol: string): ChemicalElement | undefined {
    return elementMapBySymbol.get(symbol);
  },

  getHistory(num: number): SuperheavyHistory | undefined {
    return historyMap.get(num);
  },

  filterElements(filters: {
    category?: ElementCategory | 'all';
    block?: ElementBlock | 'all';
    phase?: ElementPhase | 'all';
    search?: string;
  }): ChemicalElement[] {
    const searchLower = (filters.search || '').trim().toLowerCase();

    return elements.filter((el) => {
      if (filters.category && filters.category !== 'all' && el.category !== filters.category) {
        return false;
      }
      if (filters.block && filters.block !== 'all' && el.block !== filters.block) {
        return false;
      }
      if (filters.phase && filters.phase !== 'all' && el.phase !== filters.phase) {
        return false;
      }
      if (searchLower) {
        const matchesName = el.name.toLowerCase().includes(searchLower);
        const matchesNameEn = el.nameEn.toLowerCase().includes(searchLower);
        const matchesSymbol = el.symbol.toLowerCase().includes(searchLower);
        const matchesNumber = el.number.toString() === searchLower;
        if (!matchesName && !matchesNameEn && !matchesSymbol && !matchesNumber) {
          return false;
        }
      }
      return true;
    });
  },
};
