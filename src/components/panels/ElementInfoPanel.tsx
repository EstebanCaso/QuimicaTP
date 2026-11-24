import React from 'react';
import { X } from 'lucide-react';
import { usePeriodicStore } from '../../store/usePeriodicStore';
import { ElementRepository } from '../../domain/elements/element-repository';
import {
  CATEGORIES_META,
  PHASES_META,
  BLOCKS_META,
  GROUP_CAS_LABELS,
} from '../../domain/elements/element-metadata';
import { SHELL_LETTERS } from '../../domain/elements/electron-config';
import { AtomCanvas } from '../atom/AtomCanvas';
import { Tabs } from '../ui/Tabs';

export const ElementInfoPanel: React.FC = () => {
  const selectedSymbols = usePeriodicStore((s) => s.selectedSymbols);
  const activeTabSymbol = usePeriodicStore((s) => s.activeTabSymbol);
  const setActiveTabSymbol = usePeriodicStore((s) => s.setActiveTabSymbol);
  const setActivePanel = usePeriodicStore((s) => s.setActivePanel);

  const currentSymbol = activeTabSymbol || selectedSymbols[0];
  const element = currentSymbol ? ElementRepository.getBySymbol(currentSymbol) : undefined;
  const history = element ? ElementRepository.getHistory(element.number) : undefined;

  if (!element) return null;

  const catMeta = CATEGORIES_META[element.category] || CATEGORIES_META.unknown;
  const isSuperheavy = element.number >= 104;

  const tabItems = selectedSymbols.map((sym) => {
    const el = ElementRepository.getBySymbol(sym);
    return {
      id: sym,
      label: el ? `${el.number} ${sym} · ${el.name}` : sym,
    };
  });

  // Build rows for the physicochemical ledger (strictly omitting unmeasured null properties)
  const propertyRows: { label: string; value: string }[] = [];
  if (element.electronegativity !== null) {
    propertyRows.push({
      label: 'Electronegatividad (escala Pauling)',
      value: `${element.electronegativity}`,
    });
  }
  if (element.atomicRadius !== null) {
    propertyRows.push({ label: 'Radio atómico calculado', value: `${element.atomicRadius} pm` });
  }
  if (element.ionizationEnergy !== null) {
    propertyRows.push({
      label: 'Primera energía de ionización',
      value: `${element.ionizationEnergy} kJ/mol`,
    });
  }
  if (element.electronAffinity !== null) {
    propertyRows.push({
      label: 'Afinidad electrónica',
      value: `${element.electronAffinity} kJ/mol`,
    });
  }
  if (element.meltingPoint !== null) {
    propertyRows.push({ label: 'Punto de fusión', value: `${element.meltingPoint} °C` });
  }
  if (element.boilingPoint !== null) {
    propertyRows.push({ label: 'Punto de ebullición', value: `${element.boilingPoint} °C` });
  }
  if (element.density !== null) {
    propertyRows.push({ label: 'Densidad estándar', value: `${element.density} g/cm³` });
  }
  propertyRows.push({
    label: 'Estados de oxidación comunes',
    value: element.oxidationStates.map((s) => (s > 0 ? `+${s}` : `${s}`)).join(', ') || '0',
  });

  return (
    <div className="w-full md:w-[450px] lg:w-[490px] h-full bg-[#FCFBF7] border-l border-[#1A1917] flex flex-col z-20 overflow-hidden">
      {/* Archival Panel Title Bar */}
      <div className="px-4 py-2.5 border-b border-[#1A1917] bg-[#EDE9DF] flex items-center justify-between select-none">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#57534A] block leading-none">
            Monografía Elemental · Z = {element.number}
          </span>
          <h2 className="font-serif font-semibold text-sm text-[#1A1917] mt-0.5">
            Ficha Técnica IUPAC
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setActivePanel('none')}
          className="p-1 border border-transparent hover:border-[#1A1917] text-[#57534A] hover:text-[#1A1917] cursor-pointer transition-colors"
          title="Cerrar monografía"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Index Tabs when multiple elements are selected */}
      {selectedSymbols.length > 1 && (
        <Tabs
          items={tabItems}
          activeId={element.symbol}
          onChange={(sym) => setActiveTabSymbol(sym)}
        />
      )}

      {/* Main Scrollable Monograph */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
        {/* Hero: Oversized Classical Periodic Specimen Box + Taxonomic Ledger */}
        <div className="flex items-stretch gap-4">
          {/* Oversized Periodic Table Cell */}
          <div
            style={{ backgroundColor: catMeta.color }}
            className="w-28 min-h-[124px] border-2 border-[#1A1917] p-2 flex flex-col justify-between shrink-0 select-none"
          >
            <div className="flex justify-between items-start font-mono text-xs leading-none text-[#1A1917]">
              <span className="font-bold">{element.number}</span>
              <span className="text-[10px] text-[#57534A]">{element.atomicMass}</span>
            </div>

            <div className="flex items-center justify-between my-auto py-1">
              <span className="text-4xl font-bold tracking-tight text-[#1A1917] leading-none">
                {element.symbol}
              </span>
              <div className="flex flex-col items-end font-mono text-[9px] leading-tight text-[#3A3731]">
                {element.oxidationStates.slice(0, 4).map((ox) => (
                  <span key={ox}>{ox > 0 ? `+${ox}` : ox}</span>
                ))}
              </div>
            </div>

            <div className="border-t border-[#1A1917]/25 pt-1 text-center">
              <div className="text-[11px] font-semibold text-[#1A1917] leading-none truncate">
                {element.name}
              </div>
            </div>
          </div>

          {/* Right Taxonomic Metadata */}
          <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
            <div>
              <h3 className="font-serif text-xl font-semibold text-[#1A1917] leading-tight">
                {element.name}
              </h3>
              <div className="text-xs italic text-[#57534A]">{element.nameEn}</div>
            </div>

            <div className="mt-2 border-t border-[#D5CFC2] divide-y divide-[#E5E0D5] font-mono text-[11px]">
              <div className="py-1 flex justify-between gap-2">
                <span className="text-[#857F72]">Serie</span>
                <span className="text-[#1A1917] font-medium text-right truncate">
                  {catMeta.label}
                </span>
              </div>
              <div className="py-1 flex justify-between gap-2">
                <span className="text-[#857F72]">Posición</span>
                <span className="text-[#1A1917] text-right">
                  Per. {element.period} · Grp. {element.group} ({GROUP_CAS_LABELS[element.group]})
                </span>
              </div>
              <div className="py-1 flex justify-between gap-2">
                <span className="text-[#857F72]">Estructura</span>
                <span className="text-[#1A1917] text-right">
                  {BLOCKS_META[element.block].label} · {PHASES_META[element.phase].label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section I: 3D Atom Diagram */}
        <section className="space-y-1.5">
          <div className="flex items-baseline justify-between border-b border-[#1A1917] pb-1">
            <h4 className="font-mono text-[10px] uppercase tracking-widest font-semibold text-[#1A1917]">
              I. Estructura Atómica 3D
            </h4>
            <span className="font-mono text-[10px] text-[#57534A]">
              {element.electronShells.length} capas activas
            </span>
          </div>
          <AtomCanvas element={element} height="h-64" />
        </section>

        {/* Section II: Classical 7-Shell (K-Q) Distribution Matrix */}
        <section className="space-y-2">
          <div className="flex items-baseline justify-between border-b border-[#1A1917] pb-1">
            <h4 className="font-mono text-[10px] uppercase tracking-widest font-semibold text-[#1A1917]">
              II. Configuración Electrónica
            </h4>
            <span className="font-mono text-[11px] font-semibold text-[#1B3B6F]">
              {element.electronConfiguration}
            </span>
          </div>

          {/* 7-Column K L M N O P Q Shell Table */}
          <div className="grid grid-cols-7 border border-[#B8B0A0] bg-[#FCFBF7] text-center font-mono">
            {SHELL_LETTERS.map((letter, idx) => {
              const count = element.electronShells[idx];
              const hasElectrons = count !== undefined && count > 0;
              return (
                <div
                  key={letter}
                  className={`border-r last:border-r-0 border-[#D5CFC2] ${
                    hasElectrons ? 'bg-[#FCFBF7]' : 'bg-[#F5F2EA] opacity-55'
                  }`}
                >
                  <div className="text-[9px] py-0.5 bg-[#EDE9DF] border-b border-[#D5CFC2] text-[#57534A] font-semibold">
                    {letter} <span className="text-[8px] font-normal">({idx + 1})</span>
                  </div>
                  <div className="py-1 text-xs font-semibold text-[#1A1917]">
                    {hasElectrons ? count : '—'}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section III (Superheavy Z >= 104): Strict Nuclear Synthesis Historical Record */}
        {isSuperheavy && history && (
          <section className="border border-[#B89B67] border-l-4 border-l-[#7C5214] bg-[#F5EFE0] p-3.5 space-y-2.5">
            <div className="border-b border-[#D6C49E] pb-1.5 flex items-baseline justify-between">
              <h4 className="font-mono text-[10px] uppercase tracking-widest font-bold text-[#5C3A0B]">
                Historia de Síntesis Nuclear ({element.symbol})
              </h4>
              <span className="font-mono text-[10px] text-[#7C5214]">Año {history.year}</span>
            </div>

            <div className="text-xs space-y-2 text-[#2B261E] leading-relaxed">
              <div>
                <span className="font-mono text-[10px] uppercase text-[#7C5214] block">
                  Centro de investigación
                </span>
                <span>{history.synthesizedBy}</span>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-[#7C5214] block">
                  Reacción nuclear de síntesis
                </span>
                <span className="inline-block mt-0.5 font-mono font-semibold text-[#1A1917] bg-[#FCFBF7] px-2 py-0.5 border border-[#C9B58C]">
                  {history.reaction}
                </span>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-[#7C5214] block">
                  Período de semidesintegración conocido
                </span>
                <span className="font-mono">{history.halfLife}</span>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-[#7C5214] block">
                  Denominación oficial IUPAC
                </span>
                <span>{history.namingStory}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#D6C49E] text-[11px] text-[#4A3718] leading-relaxed">
              <strong className="font-mono text-[10px] uppercase tracking-wider block mb-0.5">
                Ausencia de constantes macroscópicas:
              </strong>
              {history.missingDataReason}
            </div>
          </section>
        )}

        {/* Section IV: Physicochemical Constants Ledger */}
        <section className="space-y-1.5">
          <div className="flex items-center justify-between border-b border-[#1A1917] pb-1">
            <h4 className="font-mono text-[10px] uppercase tracking-widest font-semibold text-[#1A1917]">
              III. Constantes Fisicoquímicas
            </h4>
            {element.isPredicted && (
              <span className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 border border-[#B89B67] bg-[#F5EFE0] text-[#5C3A0B]">
                Predicción teórica
              </span>
            )}
          </div>

          <div className="divide-y divide-[#DFDAD0] border-b border-[#1A1917] text-xs">
            {propertyRows.map((row) => (
              <div
                key={row.label}
                className="py-1.5 flex items-baseline justify-between gap-3 hover:bg-[#F5F2EA] px-1 transition-colors"
              >
                <span className="text-[#57534A]">{row.label}</span>
                <span className="font-mono font-semibold text-[#1A1917] text-right shrink-0">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Section V: Historical & Applications Colophon */}
        <section className="space-y-2 pb-4">
          <div className="border-b border-[#1A1917] pb-1">
            <h4 className="font-mono text-[10px] uppercase tracking-widest font-semibold text-[#1A1917]">
              IV. Reseña Histórica y Aplicaciones
            </h4>
          </div>

          <div className="space-y-2 text-xs text-[#2B2925] leading-relaxed">
            <div>
              <span className="font-mono text-[10px] uppercase text-[#857F72] block">
                Descubrimiento ({element.yearDiscovered})
              </span>
              <span>{element.discoverer}</span>
            </div>

            <div>
              <span className="font-mono text-[10px] uppercase text-[#857F72] block">
                Etimología
              </span>
              <span className="italic text-[#3A3731]">{element.nameOrigin}</span>
            </div>

            <div>
              <span className="font-mono text-[10px] uppercase text-[#857F72] block">
                Propiedades y usos principales
              </span>
              <p className="mt-0.5 text-[#2B2925]">{element.summary}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
