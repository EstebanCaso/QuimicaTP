import React from 'react';
import { Search, X } from 'lucide-react';
import { usePeriodicStore } from '../../store/usePeriodicStore';
import { CATEGORIES_META, PHASES_META } from '../../domain/elements/element-metadata';
import type { ElementCategory, ElementBlock, ElementPhase } from '../../domain/chemistry-types';

const BLOCK_KEYS: ElementBlock[] = ['s', 'p', 'd', 'f'];

// Display main 10 chemical families in classical periodic order
const LEGEND_CATEGORY_KEYS: ElementCategory[] = [
  'alkali-metal',
  'alkaline-earth-metal',
  'transition-metal',
  'post-transition-metal',
  'metalloid',
  'reactive-nonmetal',
  'halogen',
  'noble-gas',
  'lanthanide',
  'actinide',
];

export const FilterBar: React.FC = () => {
  const searchQuery = usePeriodicStore((s) => s.searchQuery);
  const setSearchQuery = usePeriodicStore((s) => s.setSearchQuery);
  const categoryFilter = usePeriodicStore((s) => s.categoryFilter);
  const setCategoryFilter = usePeriodicStore((s) => s.setCategoryFilter);
  const blockFilter = usePeriodicStore((s) => s.blockFilter);
  const setBlockFilter = usePeriodicStore((s) => s.setBlockFilter);
  const phaseFilter = usePeriodicStore((s) => s.phaseFilter);
  const setPhaseFilter = usePeriodicStore((s) => s.setPhaseFilter);
  const resetFilters = usePeriodicStore((s) => s.resetFilters);

  const hasActiveFilters =
    searchQuery !== '' ||
    categoryFilter !== 'all' ||
    blockFilter !== 'all' ||
    phaseFilter !== 'all';

  return (
    <div className="w-full bg-[#EDE9DF] border-b border-[#C8C1B2] px-3 sm:px-5 py-1.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 z-20 select-none">
      {/* Left: Search + Block + Phase */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Search Box */}
        <div className="relative w-48 sm:w-56">
          <Search className="w-3.5 h-3.5 text-[#857F72] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Elemento, símbolo o Z..."
            aria-label="Buscar elemento por nombre, símbolo o número atómico"
            className="w-full pl-7 pr-6 py-1 text-xs font-mono bg-[#FCFBF7] border border-[#B8B0A0] text-[#1A1917] placeholder-[#857F72] rounded-[2px] focus:outline-none focus:border-[#1A1917]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#857F72] hover:text-[#1A1917] p-0.5 cursor-pointer"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Segmented Orbital Block Filter */}
        <div className="inline-flex items-center border border-[#B8B0A0] bg-[#FCFBF7]" role="group" aria-label="Filtro por bloque orbital">
          <span className="px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-[#57534A] bg-[#EDE9DF] border-r border-[#B8B0A0]">
            Bloque
          </span>
          {BLOCK_KEYS.map((b) => {
            const active = blockFilter === b;
            return (
              <button
                key={b}
                type="button"
                onClick={() => setBlockFilter(active ? 'all' : b)}
                className={`px-2 py-1 font-mono text-[11px] border-r last:border-r-0 border-[#D5CFC2] cursor-pointer transition-colors ${
                  active
                    ? 'bg-[#1B3B6F] text-[#FCFBF7] font-semibold'
                    : 'text-[#1A1917] hover:bg-[#EDE9DF]'
                }`}
                title={`Filtrar orbitales ${b}`}
              >
                {b}
              </button>
            );
          })}
        </div>

        {/* Phase at 25 °C Select */}
        <div className="inline-flex items-center border border-[#B8B0A0] bg-[#FCFBF7]">
          <label
            htmlFor="phase-filter-select"
            className="px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-[#57534A] bg-[#EDE9DF] border-r border-[#B8B0A0]"
          >
            25 °C
          </label>
          <select
            id="phase-filter-select"
            value={phaseFilter}
            onChange={(e) => setPhaseFilter(e.target.value as ElementPhase | 'all')}
            className="text-[11px] font-mono px-2 py-1 bg-[#FCFBF7] text-[#1A1917] focus:outline-none cursor-pointer"
          >
            <option value="all">Todos</option>
            {Object.entries(PHASES_META).map(([key, meta]) => (
              <option key={key} value={key}>
                {meta.label}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-[#9E2A2B] border border-[#C99696] bg-[#FCFBF7] hover:bg-[#F7E8E8] cursor-pointer transition-colors"
          >
            Limpiar filtro
          </button>
        )}
      </div>

      {/* Right: Integrated Classical Wall-Chart Category Legend Swatches */}
      <div
        className="flex items-center gap-1 overflow-x-auto max-w-full py-0.5"
        role="group"
        aria-label="Leyenda y filtro por serie química"
      >
        {LEGEND_CATEGORY_KEYS.map((key) => {
          const meta = CATEGORIES_META[key];
          const isSelected = categoryFilter === key;
          const isDimmed = categoryFilter !== 'all' && !isSelected;

          return (
            <button
              key={key}
              type="button"
              onClick={() => setCategoryFilter(isSelected ? 'all' : key)}
              className={`inline-flex items-center gap-1.5 px-1.5 py-0.5 border text-[10px] whitespace-nowrap cursor-pointer transition-all ${
                isSelected
                  ? 'bg-[#FCFBF7] border-[#1A1917] ring-1 ring-[#1A1917] font-semibold text-[#1A1917]'
                  : 'bg-[#FCFBF7]/80 border-[#C8C1B2] text-[#3F3C35] hover:border-[#1A1917] hover:bg-[#FCFBF7]'
              } ${isDimmed ? 'opacity-50' : 'opacity-100'}`}
              title={`Filtrar serie: ${meta.label}`}
            >
              <span
                style={{ backgroundColor: meta.color, borderColor: meta.borderColor }}
                className="w-2.5 h-2.5 border shrink-0"
              />
              <span>{meta.shortLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
