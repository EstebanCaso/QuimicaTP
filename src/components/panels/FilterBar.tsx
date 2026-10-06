import React from 'react';
import { Search, RotateCcw, Box, Eye, Grid } from 'lucide-react';
import { usePeriodicStore } from '../../store/usePeriodicStore';
import { CATEGORIES_META, BLOCKS_META, PHASES_META } from '../../domain/elements/element-metadata';
import type { ElementCategory, ElementBlock, ElementPhase } from '../../domain/chemistry-types';
import { Button } from '../ui/Button';

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

  const viewMode = usePeriodicStore((s) => s.viewMode);
  const setViewMode = usePeriodicStore((s) => s.setViewMode);
  const triggerCameraReset = usePeriodicStore((s) => s.triggerCameraReset);

  const hasActiveFilters =
    searchQuery !== '' ||
    categoryFilter !== 'all' ||
    blockFilter !== 'all' ||
    phaseFilter !== 'all';

  return (
    <div className="w-full bg-white border-b border-neutral-200 px-3 py-2 flex flex-wrap items-center justify-between gap-2 shadow-xs">
      {/* Search and Filters */}
      <div className="flex flex-wrap items-center gap-2 grow">
        {/* Search */}
        <div className="relative min-w-[170px] sm:min-w-[210px]">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, símbolo o Z..."
            className="w-full pl-8 pr-2.5 py-1 text-xs rounded-md border border-neutral-300 bg-neutral-50 text-neutral-800 placeholder-neutral-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 text-xs cursor-pointer"
            >
              ×
            </button>
          )}
        </div>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as ElementCategory | 'all')}
          className="text-xs px-2.5 py-1 rounded-md border border-neutral-300 bg-white text-neutral-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
        >
          <option value="all">Todas las categorías</option>
          {Object.entries(CATEGORIES_META).map(([key, meta]) => (
            <option key={key} value={key}>
              {meta.label}
            </option>
          ))}
        </select>

        {/* Block Filter */}
        <select
          value={blockFilter}
          onChange={(e) => setBlockFilter(e.target.value as ElementBlock | 'all')}
          className="text-xs px-2.5 py-1 rounded-md border border-neutral-300 bg-white text-neutral-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
        >
          <option value="all">Todos los bloques</option>
          {Object.entries(BLOCKS_META).map(([key, meta]) => (
            <option key={key} value={key}>
              {meta.label}
            </option>
          ))}
        </select>

        {/* Phase Filter */}
        <select
          value={phaseFilter}
          onChange={(e) => setPhaseFilter(e.target.value as ElementPhase | 'all')}
          className="text-xs px-2.5 py-1 rounded-md border border-neutral-300 bg-white text-neutral-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
        >
          <option value="all">Todos los estados (25 °C)</option>
          {Object.entries(PHASES_META).map(([key, meta]) => (
            <option key={key} value={key}>
              {meta.label}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <Button size="sm" variant="ghost" onClick={resetFilters}>
            Restablecer filtros
          </Button>
        )}
      </div>

      {/* View Mode & Camera Controls */}
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="inline-flex rounded-md border border-neutral-300 bg-neutral-100 p-0.5 gap-0.5">
          <button
            type="button"
            onClick={() => setViewMode('3d')}
            className={`px-2 py-1 text-xs font-medium rounded flex items-center gap-1 cursor-pointer transition-colors ${
              viewMode === '3d'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
            title="Espacio 3D orbital con rotación libre"
          >
            <Box className="w-3 h-3 text-blue-600" />
            <span className="hidden sm:inline">3D</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('flat')}
            className={`px-2 py-1 text-xs font-medium rounded flex items-center gap-1 cursor-pointer transition-colors ${
              viewMode === 'flat'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
            title="Vista frontal plana perpendicular para lectura clásica"
          >
            <Eye className="w-3 h-3 text-blue-600" />
            <span className="hidden sm:inline">Frontal</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('2d')}
            className={`px-2 py-1 text-xs font-medium rounded flex items-center gap-1 cursor-pointer transition-colors ${
              viewMode === '2d'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
            title="Tabla clásica accesible en cuadrícula HTML 2D"
          >
            <Grid className="w-3 h-3 text-blue-600" />
            <span className="hidden sm:inline">2D</span>
          </button>
        </div>

        {viewMode !== '2d' && (
          <Button
            size="sm"
            variant="secondary"
            onClick={triggerCameraReset}
            icon={<RotateCcw className="w-3 h-3 text-neutral-600" />}
            title="Restablecer posición de cámara"
          >
            <span className="hidden md:inline">Centrar</span>
          </Button>
        )}
      </div>
    </div>
  );
};
