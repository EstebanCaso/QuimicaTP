import React from 'react';
import { usePeriodicStore } from '../../store/usePeriodicStore';
import { CATEGORIES_META } from '../../domain/elements/element-metadata';

export const HoverHUD: React.FC = () => {
  const hoveredElement = usePeriodicStore((s) => s.hoveredElement);

  if (!hoveredElement) return null;

  const catMeta = CATEGORIES_META[hoveredElement.category] || CATEGORIES_META.unknown;

  return (
    <div className="absolute top-14 right-3 z-20 pointer-events-none animate-in fade-in duration-150">
      <div
        style={{ borderColor: catMeta.borderColor }}
        className="bg-white/95 backdrop-blur-xs border rounded-lg shadow-sm px-3 py-2 flex items-center gap-3 text-xs max-w-sm"
      >
        <span
          style={{ backgroundColor: catMeta.color, borderColor: catMeta.borderColor }}
          className="w-9 h-9 rounded border flex items-center justify-center font-bold text-base text-neutral-900 shrink-0"
        >
          {hoveredElement.symbol}
        </span>

        <div className="leading-tight">
          <div className="font-bold text-neutral-900 text-sm">
            {hoveredElement.name}{' '}
            <span className="font-normal text-neutral-500 text-xs italic">({hoveredElement.nameEn})</span>
          </div>
          <div className="text-[11px] text-neutral-600 mt-0.5">
            Z = <span className="font-semibold text-neutral-800">{hoveredElement.number}</span> · Masa: {hoveredElement.atomicMass} u · Periodo {hoveredElement.period}, Grupo {hoveredElement.group}
          </div>
          <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
            {hoveredElement.electronConfiguration}
          </div>
        </div>
      </div>
    </div>
  );
};
