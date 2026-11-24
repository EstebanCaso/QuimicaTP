import React from 'react';
import { usePeriodicStore } from '../../store/usePeriodicStore';
import { CATEGORIES_META, GROUP_CAS_LABELS, PHASES_META } from '../../domain/elements/element-metadata';

export const HoverHUD: React.FC = () => {
  const hoveredElement = usePeriodicStore((s) => s.hoveredElement);
  const viewMode = usePeriodicStore((s) => s.viewMode);

  // In 2D mode, the integrated central Specimen Key Box already displays live hover details
  if (!hoveredElement || viewMode === '2d') return null;

  const catMeta = CATEGORIES_META[hoveredElement.category] || CATEGORIES_META.unknown;

  return (
    <div className="absolute top-3 right-3 z-20 pointer-events-none">
      <div className="bg-[#FCFBF7] border-[1.5px] border-[#1A1917] p-2.5 flex items-center gap-3 max-w-sm">
        {/* Authentic Miniature Periodic Cell */}
        <div
          style={{ backgroundColor: catMeta.color }}
          className="w-16 h-20 border border-[#1A1917] p-1 flex flex-col justify-between shrink-0"
        >
          <div className="flex justify-between items-start font-mono text-[9px] leading-none text-[#1A1917]">
            <span className="font-bold">{hoveredElement.number}</span>
            <span className="text-[8px] text-[#57534A]">
              {hoveredElement.atomicMass < 100
                ? hoveredElement.atomicMass.toFixed(2)
                : Math.round(hoveredElement.atomicMass)}
            </span>
          </div>
          <div className="flex items-center justify-between my-auto px-0.5">
            <span className="text-xl font-bold tracking-tight text-[#1A1917] leading-none">
              {hoveredElement.symbol}
            </span>
            <div className="flex flex-col items-end font-mono text-[7px] leading-tight text-[#57534A]">
              {hoveredElement.oxidationStates.slice(0, 3).map((ox) => (
                <span key={ox}>{ox > 0 ? `+${ox}` : ox}</span>
              ))}
            </div>
          </div>
          <div className="font-mono text-[7.5px] text-center text-[#1A1917] truncate border-t border-[#1A1917]/20 pt-0.5">
            {hoveredElement.name}
          </div>
        </div>

        {/* Technical Metadata */}
        <div className="leading-snug pr-1">
          <div className="font-mono text-[9px] uppercase tracking-wider text-[#857F72]">
            {catMeta.label}
          </div>
          <div className="font-serif font-semibold text-[#1A1917] text-sm">
            {hoveredElement.name}{' '}
            <span className="font-normal italic text-xs text-[#57534A]">
              ({hoveredElement.nameEn})
            </span>
          </div>
          <div className="font-mono text-[10px] text-[#57534A] mt-0.5">
            Grupo {hoveredElement.group} ({GROUP_CAS_LABELS[hoveredElement.group]}) · Período{' '}
            {hoveredElement.period} · {PHASES_META[hoveredElement.phase].label}
          </div>
          <div className="font-mono text-[10px] text-[#1B3B6F] mt-0.5">
            {hoveredElement.electronConfiguration}
          </div>
        </div>
      </div>
    </div>
  );
};
