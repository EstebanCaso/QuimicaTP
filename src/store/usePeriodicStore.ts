import { create } from 'zustand';
import type { ChemicalElement, ElementBlock, ElementCategory, ElementPhase } from '../domain/chemistry-types';
import { ElementRepository } from '../domain/elements/element-repository';

export interface PeriodicState {
  // Selection
  selectedSymbols: string[];
  activeTabSymbol: string | null;
  toggleElement: (symbol: string) => void;
  selectElement: (symbol: string) => void;
  deselectElement: (symbol: string) => void;
  setSelectedSymbols: (symbols: string[]) => void;
  clearSelection: () => void;
  setActiveTabSymbol: (symbol: string | null) => void;

  // Hover
  hoveredElement: ChemicalElement | null;
  setHoveredElement: (el: ChemicalElement | null) => void;

  // Filters
  categoryFilter: ElementCategory | 'all';
  blockFilter: ElementBlock | 'all';
  phaseFilter: ElementPhase | 'all';
  searchQuery: string;
  setCategoryFilter: (cat: ElementCategory | 'all') => void;
  setBlockFilter: (block: ElementBlock | 'all') => void;
  setPhaseFilter: (phase: ElementPhase | 'all') => void;
  setSearchQuery: (q: string) => void;
  resetFilters: () => void;

  // Camera & View
  viewMode: '3d' | 'flat' | '2d';
  setViewMode: (mode: '3d' | 'flat' | '2d') => void;
  cameraResetKey: number;
  triggerCameraReset: () => void;

  // 3D Representative Models on Tiles
  show3DObjects: boolean;
  setShow3DObjects: (show: boolean) => void;
  toggle3DObjects: () => void;

  // Panel state
  activePanel: 'none' | 'info' | 'compounds';
  setActivePanel: (panel: 'none' | 'info' | 'compounds') => void;
}

export const usePeriodicStore = create<PeriodicState>((set) => ({
  selectedSymbols: [],
  activeTabSymbol: null,

  toggleElement: (symbol: string) =>
    set((state) => {
      const exists = state.selectedSymbols.includes(symbol);
      let newSelection: string[];
      let nextActive = state.activeTabSymbol;

      if (exists) {
        newSelection = state.selectedSymbols.filter((s) => s !== symbol);
        if (nextActive === symbol) {
          nextActive = newSelection.length > 0 ? newSelection[newSelection.length - 1] : null;
        }
      } else {
        newSelection = [...state.selectedSymbols, symbol];
        nextActive = symbol;
      }

      // Auto-open panel based on selection count
      let nextPanel = state.activePanel;
      if (newSelection.length === 0) {
        nextPanel = 'none';
      } else if (newSelection.length === 1) {
        nextPanel = 'info';
      } else if (newSelection.length >= 2) {
        // When 2 or more, prioritize compounds or keep info
        if (nextPanel === 'none') {
          nextPanel = 'compounds';
        }
      }

      return {
        selectedSymbols: newSelection,
        activeTabSymbol: nextActive,
        activePanel: nextPanel,
      };
    }),

  selectElement: (symbol: string) =>
    set((state) => {
      if (state.selectedSymbols.includes(symbol)) {
        return { activeTabSymbol: symbol, activePanel: 'info' };
      }
      const newSelection = [...state.selectedSymbols, symbol];
      return {
        selectedSymbols: newSelection,
        activeTabSymbol: symbol,
        activePanel: newSelection.length >= 2 ? state.activePanel : 'info',
      };
    }),

  deselectElement: (symbol: string) =>
    set((state) => {
      const newSelection = state.selectedSymbols.filter((s) => s !== symbol);
      const nextActive =
        state.activeTabSymbol === symbol
          ? newSelection.length > 0
            ? newSelection[newSelection.length - 1]
            : null
          : state.activeTabSymbol;

      return {
        selectedSymbols: newSelection,
        activeTabSymbol: nextActive,
        activePanel: newSelection.length === 0 ? 'none' : state.activePanel,
      };
    }),

  setSelectedSymbols: (symbols: string[]) => {
    const validSymbols = symbols.filter((s) => ElementRepository.getBySymbol(s) !== undefined);
    set({
      selectedSymbols: validSymbols,
      activeTabSymbol: validSymbols.length > 0 ? validSymbols[0] : null,
      activePanel:
        validSymbols.length >= 2 ? 'compounds' : validSymbols.length === 1 ? 'info' : 'none',
    });
  },

  clearSelection: () =>
    set({
      selectedSymbols: [],
      activeTabSymbol: null,
      activePanel: 'none',
    }),

  setActiveTabSymbol: (symbol: string | null) =>
    set({
      activeTabSymbol: symbol,
      activePanel: symbol ? 'info' : 'none',
    }),

  hoveredElement: null,
  setHoveredElement: (el) => set({ hoveredElement: el }),

  categoryFilter: 'all',
  blockFilter: 'all',
  phaseFilter: 'all',
  searchQuery: '',

  setCategoryFilter: (cat) => set({ categoryFilter: cat }),
  setBlockFilter: (block) => set({ blockFilter: block }),
  setPhaseFilter: (phase) => set({ phaseFilter: phase }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  resetFilters: () =>
    set({
      categoryFilter: 'all',
      blockFilter: 'all',
      phaseFilter: 'all',
      searchQuery: '',
    }),

  viewMode: '3d',
  setViewMode: (mode) => set({ viewMode: mode }),
  cameraResetKey: 0,
  triggerCameraReset: () =>
    set((state) => ({ cameraResetKey: state.cameraResetKey + 1 })),

  show3DObjects: true,
  setShow3DObjects: (show) => set({ show3DObjects: show }),
  toggle3DObjects: () => set((state) => ({ show3DObjects: !state.show3DObjects })),

  activePanel: 'none',
  setActivePanel: (panel) => set({ activePanel: panel }),
}));
