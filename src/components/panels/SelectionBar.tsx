import React from 'react';
import { Trash2, FlaskConical, Atom, X } from 'lucide-react';
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
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-30 max-w-[94vw] w-auto bg-white/95 backdrop-blur-sm border border-neutral-300 rounded-lg shadow-md px-3 py-2 flex items-center gap-2 sm:gap-3">
      {/* Selected elements list as chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto max-w-[50vw] sm:max-w-[60vw] py-0.5">
        <span className="text-xs font-semibold text-neutral-500 whitespace-nowrap hidden sm:inline mr-1">
          Seleccionados ({selectedSymbols.length}):
        </span>

        {selectedSymbols.map((sym) => {
          const el = ElementRepository.getBySymbol(sym);
          const catMeta = el ? CATEGORIES_META[el.category] : undefined;
          const isActive = activeTabSymbol === sym;

          return (
            <div
              key={sym}
              onClick={() => {
                setActiveTabSymbol(sym);
                setActivePanel('info');
              }}
              style={{ backgroundColor: catMeta?.color }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-medium cursor-pointer transition-all shrink-0 ${
                isActive
                  ? 'border-blue-600 ring-2 ring-blue-500 shadow-xs'
                  : 'border-neutral-300 hover:border-neutral-400'
              }`}
              title={`Ver ficha de ${el?.name || sym}`}
            >
              <span className="font-bold text-neutral-900">{sym}</span>
              <span className="text-[11px] text-neutral-600 hidden md:inline">{el?.name}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  deselectElement(sym);
                }}
                className="p-0.5 rounded text-neutral-500 hover:text-neutral-900 hover:bg-black/10 cursor-pointer"
                title={`Quitar ${sym}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="h-5 w-px bg-neutral-200 shrink-0" />

      {/* Action buttons */}
      <div className="flex items-center gap-1.5 shrink-0">
        <Button
          size="sm"
          variant={activePanel === 'info' ? 'primary' : 'secondary'}
          onClick={() => setActivePanel(activePanel === 'info' ? 'none' : 'info')}
          icon={<Atom className="w-3.5 h-3.5" />}
          title="Ver modelo 3D y ficha técnica del átomo"
        >
          <span className="hidden sm:inline">Átomo</span>
        </Button>

        {selectedSymbols.length >= 2 && (
          <Button
            size="sm"
            variant={activePanel === 'compounds' ? 'primary' : 'secondary'}
            onClick={() => setActivePanel(activePanel === 'compounds' ? 'none' : 'compounds')}
            icon={<FlaskConical className="w-3.5 h-3.5" />}
            title="Ver compuestos químicos generados"
          >
            <span>Compuestos</span>
          </Button>
        )}

        <Button
          size="sm"
          variant="danger"
          onClick={clearSelection}
          icon={<Trash2 className="w-3.5 h-3.5" />}
          title="Limpiar toda la selección"
        >
          <span className="hidden md:inline">Limpiar</span>
        </Button>
      </div>
    </div>
  );
};
