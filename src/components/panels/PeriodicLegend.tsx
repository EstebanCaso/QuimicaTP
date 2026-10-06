import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Palette } from 'lucide-react';
import { CATEGORIES_META } from '../../domain/elements/element-metadata';
import { usePeriodicStore } from '../../store/usePeriodicStore';

export const PeriodicLegend: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const categoryFilter = usePeriodicStore((s) => s.categoryFilter);
  const setCategoryFilter = usePeriodicStore((s) => s.setCategoryFilter);

  return (
    <div className="absolute top-14 left-3 z-20 max-w-[90vw] sm:max-w-xs bg-white/95 backdrop-blur-xs border border-neutral-300 rounded-lg shadow-xs overflow-hidden select-none">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-2.5 py-1.5 flex items-center justify-between text-xs font-semibold text-neutral-800 hover:bg-neutral-50 cursor-pointer transition-colors"
      >
        <span className="flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-blue-600" />
          Leyenda de Categorías
        </span>
        {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-neutral-500" /> : <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />}
      </button>

      {isExpanded && (
        <div className="p-2 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] max-h-64 overflow-y-auto">
          {Object.entries(CATEGORIES_META).map(([key, meta]) => {
            const isSelected = categoryFilter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setCategoryFilter(isSelected ? 'all' : (key as import('../../domain/chemistry-types').ElementCategory))}
                className={`flex items-center gap-1.5 px-2 py-1 rounded text-left transition-colors cursor-pointer ${
                  isSelected ? 'bg-blue-50 border border-blue-300 font-semibold' : 'hover:bg-neutral-100'
                }`}
              >
                <span
                  style={{ backgroundColor: meta.color, borderColor: meta.borderColor }}
                  className="w-3 h-3 rounded-xs border shrink-0"
                />
                <span className="truncate text-neutral-700">{meta.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
