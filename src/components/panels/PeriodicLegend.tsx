import React from 'react';
import { CATEGORIES_META, BLOCKS_META, PHASES_META } from '../../domain/elements/element-metadata';
import { usePeriodicStore } from '../../store/usePeriodicStore';

export const PeriodicLegend: React.FC = () => {
  const categoryFilter = usePeriodicStore((s) => s.categoryFilter);
  const blockFilter = usePeriodicStore((s) => s.blockFilter);
  const phaseFilter = usePeriodicStore((s) => s.phaseFilter);
  const selectedCount = usePeriodicStore((s) => s.selectedSymbols.length);

  // Hide colophon on small viewports when selection bar is visible so they never overlap
  if (selectedCount > 0) return null;

  const activeNotes: string[] = [];
  if (categoryFilter !== 'all') activeNotes.push(CATEGORIES_META[categoryFilter].label);
  if (blockFilter !== 'all') activeNotes.push(BLOCKS_META[blockFilter].label);
  if (phaseFilter !== 'all') activeNotes.push(PHASES_META[phaseFilter].label);

  return (
    <div className="hidden md:block absolute bottom-3 left-4 z-10 pointer-events-none select-none">
      <div className="font-mono text-[10px] text-[#787163] tracking-wide flex items-center gap-2.5">
        <span>ESCALA DE MASA ATÓMICA: ¹²C = 12</span>
        <span>·</span>
        <span>CONDICIONES ESTÁNDAR: 298.15 K, 100 kPa</span>
        {activeNotes.length > 0 && (
          <>
            <span>·</span>
            <span className="text-[#1B3B6F] font-semibold">
              FILTRO: {activeNotes.join(' / ')}
            </span>
          </>
        )}
      </div>
    </div>
  );
};
