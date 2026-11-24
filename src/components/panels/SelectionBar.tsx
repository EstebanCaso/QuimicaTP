import React from 'react';
import { X } from 'lucide-react';
import { usePeriodicStore } from '../../store/usePeriodicStore';
import { ElementRepository } from '../../domain/elements/element-repository';
import { CATEGORIES_META } from '../../domain/elements/element-metadata';
import { Button } from '../ui/Button';

export const SelectionBar: React.FC = () => {
  const selectedSymbols = usePeriodicStore((s) => s.selectedSymbols);
  const activeTabSymbol = usePeriodicStore((s) => s.activeTabSymbol);
  const deselectElement = usePeriodicStore((s) => s.deselectElement);
  const clearSelection = usePeriodicStore((s) => s.clearSelection);
  const setActiveTabSymbol = usePeriodicStore((s) => s.setActiveTabSymbol);
  const activePanel = usePeriodicStore((s) => s.activePanel);
  const setActivePanel = usePeriodicStore((s) => s.setActivePanel);

  if (selectedSymbols.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-30 max-w-[95vw] w-auto bg-[#FCFBF7] border-[1.5px] border-[#1A1917] px-3 py-2 flex items-center gap-2.5 sm:gap-3.5 select-none">
      {/* Selected Element Specimen Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto max-w-[48vw] sm:max-w-[58vw] py-0.5">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[#57534A] whitespace-nowrap hidden sm:inline mr-1">
          Selección [{selectedSymbols.length}]:
        </span>

        {selectedSymbols.map((sym) => {
          const el = ElementRepository.getBySymbol(sym);
          const catMeta = el ? CATEGORIES_META[el.category] : undefined;
          const isActive = activeTabSymbol === sym && activePanel === 'info';

          return (
            <div
              key={sym}
              onClick={() => {
                setActiveTabSymbol(sym);
                setActivePanel('info');
              }}
              style={{ backgroundColor: catMeta?.color }}
              className={`flex items-center gap-1.5 px-2 py-0.5 border text-xs cursor-pointer transition-colors shrink-0 ${
                isActive
                  ? 'border-[#1A1917] ring-1 ring-[#1A1917]'
                  : 'border-[#ACA493] hover:border-[#1A1917]'
              }`}
              title={`Abrir monografía de ${el?.name || sym}`}
            >
              <span className="font-mono text-[10px] text-[#57534A]">{el?.number}</span>
              <span className="font-bold text-[#1A1917]">{sym}</span>
              <span className="text-[11px] text-[#3A3731] hidden md:inline">{el?.name}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  deselectElement(sym);
                }}
                className="p-0.5 text-[#57534A] hover:text-[#1A1917] hover:bg-black/10 cursor-pointer"
                title={`Retirar ${sym}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="h-5 w-px bg-[#D5CFC2] shrink-0" />

      {/* Panel Switchers */}
      <div className="flex items-center gap-1.5 shrink-0">
        <Button
          size="sm"
          variant={activePanel === 'info' ? 'primary' : 'secondary'}
          onClick={() => setActivePanel(activePanel === 'info' ? 'none' : 'info')}
          title="Ver ficha técnica y modelo atómico 3D"
        >
          <span className="font-mono uppercase text-[10px]">Ficha Atómica</span>
        </Button>

        {selectedSymbols.length >= 2 && (
          <Button
            size="sm"
            variant={activePanel === 'compounds' ? 'primary' : 'secondary'}
            onClick={() => setActivePanel(activePanel === 'compounds' ? 'none' : 'compounds')}
            title="Abrir generador de compuestos estequiométricos"
          >
            <span className="font-mono uppercase text-[10px]">Compuestos</span>
          </Button>
        )}

        <Button
          size="sm"
          variant="danger"
          onClick={clearSelection}
          title="Vaciar toda la selección"
        >
          <span className="font-mono uppercase text-[10px]">Limpiar</span>
        </Button>
      </div>
    </div>
  );
};
