import React from 'react';
import { X, BookOpen, AlertCircle, Layers } from 'lucide-react';
import { usePeriodicStore } from '../../store/usePeriodicStore';
import { ElementRepository } from '../../domain/elements/element-repository';
import { CATEGORIES_META, PHASES_META, BLOCKS_META } from '../../domain/elements/element-metadata';
import { parseShellDetails } from '../../domain/elements/electron-config';
import { AtomCanvas } from '../atom/AtomCanvas';
import { Tabs } from '../ui/Tabs';

export const ElementInfoPanel: React.FC = () => {
  const selectedSymbols = usePeriodicStore((s) => s.selectedSymbols);
  const activeTabSymbol = usePeriodicStore((s) => s.activeTabSymbol);
  const setActiveTabSymbol = usePeriodicStore((s) => s.setActiveTabSymbol);
  const setActivePanel = usePeriodicStore((s) => s.setActivePanel);

  // If no active tab but elements are selected, default to first
  const currentSymbol = activeTabSymbol || selectedSymbols[0];
  const element = currentSymbol ? ElementRepository.getBySymbol(currentSymbol) : undefined;
  const history = element ? ElementRepository.getHistory(element.number) : undefined;

  if (!element) return null;

  const catMeta = CATEGORIES_META[element.category] || CATEGORIES_META.unknown;
  const shellDetails = parseShellDetails(element.electronShells);
  const isSuperheavy = element.number >= 104;

  const tabItems = selectedSymbols.map((sym) => {
    const el = ElementRepository.getBySymbol(sym);
    return {
      id: sym,
      label: `${sym} ${el ? el.name : ''}`,
    };
  });

  return (
    <div className="w-full md:w-[440px] lg:w-[480px] h-full bg-white border-l border-neutral-200 flex flex-col shadow-lg z-20 overflow-hidden">
      {/* Top Header */}
      <div className="p-3 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70">
        <div className="flex items-center gap-2">
          <span
            style={{ backgroundColor: catMeta.color, borderColor: catMeta.borderColor }}
            className="w-8 h-8 rounded border flex items-center justify-center font-bold text-sm text-neutral-900"
          >
            {element.symbol}
          </span>
          <div>
            <h2 className="text-sm font-bold text-neutral-900 leading-tight">
              {element.name}{' '}
              <span className="text-xs font-normal text-neutral-500 italic">({element.nameEn})</span>
            </h2>
            <div className="text-[11px] text-neutral-500">
              Número atómico: <span className="font-semibold text-neutral-800">{element.number}</span> · Masa: {element.atomicMass} u
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActivePanel('none')}
          className="p-1 rounded text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/60 cursor-pointer transition-colors"
          title="Cerrar panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs if multiple elements selected */}
      {selectedSymbols.length > 1 && (
        <Tabs
          items={tabItems}
          activeId={element.symbol}
          onChange={(sym) => setActiveTabSymbol(sym)}
          className="bg-neutral-50/50 px-2"
        />
      )}

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Category & Structure Badges */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          <span
            style={{ backgroundColor: catMeta.color, borderColor: catMeta.borderColor }}
            className="px-2 py-0.5 rounded border font-medium text-neutral-800"
          >
            {catMeta.label}
          </span>
          <span className="px-2 py-0.5 rounded border border-neutral-200 bg-neutral-100 text-neutral-700">
            {BLOCKS_META[element.block].label}
          </span>
          <span className="px-2 py-0.5 rounded border border-neutral-200 bg-neutral-100 text-neutral-700">
            Periodo {element.period} · Grupo {element.group}
          </span>
          <span className="px-2 py-0.5 rounded border border-neutral-200 bg-neutral-100 text-neutral-700">
            {PHASES_META[element.phase].label}
          </span>
        </div>

        {/* 3D Atom Model Canvas */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              Modelo Atómico 3D
            </span>
            <span className="text-[11px] text-neutral-500">
              {element.electronShells.length} niveles energéticos
            </span>
          </div>
          <AtomCanvas element={element} height="h-64" />
        </div>

        {/* Electron Configuration & Shell breakdown */}
        <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200 space-y-2">
          <div className="text-xs font-semibold text-neutral-800">Distribución Electrónica</div>
          <div className="text-xs font-mono bg-white p-2 rounded border border-neutral-200 text-blue-900 break-words">
            {element.electronConfiguration}
          </div>

          <div className="text-[11px] text-neutral-600 pt-1">
            <span className="font-semibold text-neutral-700">Electrones por capa:</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {shellDetails.map((sh) => (
                <span
                  key={sh.letter}
                  className="px-2 py-0.5 rounded bg-white border border-neutral-200 text-[10px]"
                >
                  <strong className="text-neutral-900">{sh.letter}</strong> (n={sh.shellNumber}):{' '}
                  <span className="text-blue-700 font-semibold">{sh.electrons} e⁻</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Missing Data / Superheavy Element History Section (Strict IUPAC Rule) */}
        {isSuperheavy && history && (
          <div className="border border-amber-200 bg-amber-50/60 rounded-lg p-3.5 space-y-2.5">
            <div className="flex items-center gap-1.5 text-amber-900 font-semibold text-xs">
              <BookOpen className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Historia de Síntesis Nuclear ({element.symbol})</span>
            </div>

            <div className="text-xs space-y-1.5 text-neutral-800">
              <div>
                <strong className="text-neutral-900">Sintetizado por:</strong> {history.synthesizedBy} ({history.year})
              </div>
              <div>
                <strong className="text-neutral-900">Reacción nuclear:</strong>{' '}
                <span className="font-mono text-amber-950 font-bold bg-white/80 px-1.5 py-0.5 rounded border border-amber-200">
                  {history.reaction}
                </span>
              </div>
              <div>
                <strong className="text-neutral-900">Vida media conocida:</strong> {history.halfLife}
              </div>
              <div>
                <strong className="text-neutral-900">Origen del nombre:</strong> {history.namingStory}
              </div>
            </div>

            <div className="flex items-start gap-1.5 pt-2 border-t border-amber-200 text-[11px] text-amber-900">
              <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>¿Por qué no hay datos macroscópicos?</strong> {history.missingDataReason}
              </span>
            </div>
          </div>
        )}

        {/* Technical Properties Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-800">Propiedades Fisicoquímicas</span>
            {element.isPredicted && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-200 text-neutral-700 font-medium">
                Predicciones teóricas
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {element.electronegativity !== null && (
              <div className="bg-neutral-50 p-2 rounded border border-neutral-200">
                <div className="text-[10px] text-neutral-500">Electronegatividad (Pauling)</div>
                <div className="font-semibold text-neutral-900">{element.electronegativity}</div>
              </div>
            )}

            {element.atomicRadius !== null && (
              <div className="bg-neutral-50 p-2 rounded border border-neutral-200">
                <div className="text-[10px] text-neutral-500">Radio atómico</div>
                <div className="font-semibold text-neutral-900">{element.atomicRadius} pm</div>
              </div>
            )}

            {element.ionizationEnergy !== null && (
              <div className="bg-neutral-50 p-2 rounded border border-neutral-200">
                <div className="text-[10px] text-neutral-500">Energía de 1ª ionización</div>
                <div className="font-semibold text-neutral-900">{element.ionizationEnergy} kJ/mol</div>
              </div>
            )}

            {element.electronAffinity !== null && (
              <div className="bg-neutral-50 p-2 rounded border border-neutral-200">
                <div className="text-[10px] text-neutral-500">Afinidad electrónica</div>
                <div className="font-semibold text-neutral-900">{element.electronAffinity} kJ/mol</div>
              </div>
            )}

            {element.meltingPoint !== null && (
              <div className="bg-neutral-50 p-2 rounded border border-neutral-200">
                <div className="text-[10px] text-neutral-500">Punto de fusión</div>
                <div className="font-semibold text-neutral-900">{element.meltingPoint} °C</div>
              </div>
            )}

            {element.boilingPoint !== null && (
              <div className="bg-neutral-50 p-2 rounded border border-neutral-200">
                <div className="text-[10px] text-neutral-500">Punto de ebullición</div>
                <div className="font-semibold text-neutral-900">{element.boilingPoint} °C</div>
              </div>
            )}

            {element.density !== null && (
              <div className="bg-neutral-50 p-2 rounded border border-neutral-200">
                <div className="text-[10px] text-neutral-500">Densidad</div>
                <div className="font-semibold text-neutral-900">{element.density} g/cm³</div>
              </div>
            )}

            <div className="bg-neutral-50 p-2 rounded border border-neutral-200">
              <div className="text-[10px] text-neutral-500">Estados de oxidación</div>
              <div className="font-semibold text-neutral-900">
                {element.oxidationStates.map((s) => (s > 0 ? `+${s}` : s)).join(', ') || '0'}
              </div>
            </div>
          </div>
        </div>

        {/* Historical and Contextual Information */}
        <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200 space-y-2 text-xs">
          <div>
            <strong className="text-neutral-900">Descubrimiento:</strong> {element.discoverer}{' '}
            <span className="text-neutral-500">({element.yearDiscovered})</span>
          </div>
          <div>
            <strong className="text-neutral-900">Origen del nombre:</strong> {element.nameOrigin}
          </div>
          <div>
            <strong className="text-neutral-900">Resumen y aplicaciones:</strong> {element.summary}
          </div>
        </div>
      </div>
    </div>
  );
};
