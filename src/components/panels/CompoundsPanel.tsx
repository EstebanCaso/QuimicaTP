import React, { useState, useMemo } from 'react';
import { X, Copy, Check, Search } from 'lucide-react';
import { usePeriodicStore } from '../../store/usePeriodicStore';
import { generateCompounds } from '../../domain/compounds/generator';
import type { CompoundType } from '../../domain/chemistry-types';
import { Button } from '../ui/Button';

export const CompoundsPanel: React.FC = () => {
  const selectedSymbols = usePeriodicStore((s) => s.selectedSymbols);
  const setActivePanel = usePeriodicStore((s) => s.setActivePanel);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [selectedType, setSelectedType] = useState<CompoundType | 'all'>('all');

  const result = useMemo(() => {
    return generateCompounds(selectedSymbols);
  }, [selectedSymbols]);

  const handleCopy = (formula: string, id: string) => {
    try {
      navigator.clipboard.writeText(formula);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // Fallback
    }
  };

  const filteredCompounds = useMemo(() => {
    return result.compounds.filter((c) => {
      if (selectedType !== 'all' && c.type !== selectedType) {
        return false;
      }
      if (searchFilter) {
        const q = searchFilter.toLowerCase();
        const matchesFormula = c.formula.toLowerCase().includes(q);
        const matchesFormatted = c.formulaFormatted.toLowerCase().includes(q);
        const matchesSys = c.nomenclature.systematic.toLowerCase().includes(q);
        const matchesStock = c.nomenclature.stock.toLowerCase().includes(q);
        const matchesTrad = c.nomenclature.traditional.toLowerCase().includes(q);
        const matchesCommon = (c.nomenclature.common || '').toLowerCase().includes(q);
        if (
          !matchesFormula &&
          !matchesFormatted &&
          !matchesSys &&
          !matchesStock &&
          !matchesTrad &&
          !matchesCommon
        ) {
          return false;
        }
      }
      return true;
    });
  }, [result.compounds, selectedType, searchFilter]);

  const availableTypes = useMemo(() => {
    const types = new Set<CompoundType>();
    for (const c of result.compounds) {
      types.add(c.type);
    }
    return Array.from(types);
  }, [result.compounds]);

  return (
    <div className="w-full md:w-[460px] lg:w-[500px] h-full bg-[#FCFBF7] border-l border-[#1A1917] flex flex-col z-20 overflow-hidden">
      {/* Archival Panel Header */}
      <div className="px-4 py-2.5 border-b border-[#1A1917] bg-[#EDE9DF] flex items-center justify-between select-none">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#57534A] block leading-none">
            Sistema Reactivo · {selectedSymbols.join(' + ')}
          </span>
          <h2 className="font-serif font-semibold text-sm text-[#1A1917] mt-0.5">
            Formulación y Nomenclatura ({result.compounds.length})
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setActivePanel('none')}
          className="p-1 border border-transparent hover:border-[#1A1917] text-[#57534A] hover:text-[#1A1917] cursor-pointer transition-colors"
          title="Cerrar registro de compuestos"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Filter and Search Bar inside panel */}
      {result.compounds.length > 0 && (
        <div className="p-3 border-b border-[#C8C1B2] bg-[#F5F2EA] space-y-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#857F72] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filtrar por fórmula o nomenclatura..."
              className="w-full pl-8 pr-2.5 py-1 text-xs font-mono bg-[#FCFBF7] border border-[#B8B0A0] text-[#1A1917] placeholder-[#857F72] rounded-[2px] focus:outline-none focus:border-[#1A1917]"
            />
          </div>

          {availableTypes.length > 1 && (
            <div className="flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => setSelectedType('all')}
                className={`px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider border cursor-pointer transition-colors ${
                  selectedType === 'all'
                    ? 'bg-[#1A1917] text-[#FCFBF7] border-[#1A1917] font-semibold'
                    : 'bg-[#FCFBF7] text-[#57534A] border-[#C8C1B2] hover:border-[#1A1917]'
                }`}
              >
                Todos [{result.compounds.length}]
              </button>
              {availableTypes.map((t) => {
                const count = result.compounds.filter((c) => c.type === t).length;
                const sample = result.compounds.find((c) => c.type === t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedType(t)}
                    className={`px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider border cursor-pointer transition-colors ${
                      selectedType === t
                        ? 'bg-[#1A1917] text-[#FCFBF7] border-[#1A1917] font-semibold'
                        : 'bg-[#FCFBF7] text-[#57534A] border-[#C8C1B2] hover:border-[#1A1917]'
                    }`}
                  >
                    {sample?.typeLabel || t} [{count}]
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Scrollable Formulation Ledger */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {/* Noble Gases Inertness Note */}
        {result.isInert && (
          <div className="p-4 border border-[#C0AED6] border-l-4 border-l-[#462A66] bg-[#F3EEF8] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-[#462A66]">
              Nota Químico-Cuántica · Inercia de Gases Nobles
            </div>
            <p className="text-xs leading-relaxed text-[#2B2925]">{result.message}</p>
          </div>
        )}

        {/* Pure Metal Alloy Note */}
        {result.isAlloyOnly && (
          <div className="p-4 border border-[#B0BEC9] border-l-4 border-l-[#243746] bg-[#EDF1F4] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-[#243746]">
              Sistema Metálico · Aleación o Fase Intermetálica
            </div>
            <p className="text-xs leading-relaxed text-[#2B2925]">{result.message}</p>
          </div>
        )}

        {/* Empty filter state */}
        {!result.isInert && !result.isAlloyOnly && filteredCompounds.length === 0 && (
          <div className="text-center py-10 border border-dashed border-[#C8C1B2] text-xs space-y-1">
            <p className="font-serif font-semibold text-[#1A1917]">
              Sin coincidencias para el criterio actual
            </p>
            <p className="font-mono text-[11px] text-[#857F72]">
              Modifica el término de búsqueda o selecciona otra familia química.
            </p>
          </div>
        )}

        {/* Compound Formulation Sheets */}
        {filteredCompounds.map((comp) => {
          const isCopied = copiedId === comp.id;

          return (
            <article
              key={comp.id}
              className="border border-[#B8B0A0] bg-[#FCFBF7] hover:border-[#1A1917] transition-colors"
            >
              {/* Formula Header Band */}
              <div className="px-3 py-2 bg-[#EDE9DF] border-b border-[#D5CFC2] flex items-center justify-between gap-2">
                <div>
                  <div className="text-xl font-bold font-mono text-[#1A1917] tracking-tight leading-none">
                    {comp.formulaFormatted}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1 font-mono text-[9.5px] uppercase tracking-wider">
                    <span className="text-[#3A3731] font-semibold">{comp.typeLabel}</span>
                    <span className="text-[#ACA493]">·</span>
                    <span
                      className={
                        comp.bondType === 'ionico' ? 'text-[#1B3B6F]' : 'text-[#1E4631]'
                      }
                    >
                      {comp.bondType === 'ionico' ? 'Enlace Iónico' : 'Enlace Covalente'}
                    </span>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant={isCopied ? 'primary' : 'secondary'}
                  onClick={() => handleCopy(comp.formulaFormatted, comp.id)}
                  title="Copiar fórmula al portapapeles"
                  icon={
                    isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />
                  }
                >
                  <span className="font-mono uppercase text-[10px]">
                    {isCopied ? 'Copiada' : 'Copiar'}
                  </span>
                </Button>
              </div>

              {/* Tabular Triple Nomenclature Ledger */}
              <div className="divide-y divide-[#E5E0D5] text-xs px-3">
                <div className="py-1.5 grid grid-cols-[105px_1fr] gap-2 items-baseline">
                  <span className="font-mono text-[9.5px] uppercase tracking-wider text-[#857F72]">
                    Sistemática
                  </span>
                  <span className="font-medium text-[#1A1917]">{comp.nomenclature.systematic}</span>
                </div>

                <div className="py-1.5 grid grid-cols-[105px_1fr] gap-2 items-baseline">
                  <span className="font-mono text-[9.5px] uppercase tracking-wider text-[#857F72]">
                    Stock
                  </span>
                  <span className="text-[#1A1917]">{comp.nomenclature.stock}</span>
                </div>

                <div className="py-1.5 grid grid-cols-[105px_1fr] gap-2 items-baseline">
                  <span className="font-mono text-[9.5px] uppercase tracking-wider text-[#857F72]">
                    Tradicional
                  </span>
                  <span className="italic text-[#3A3731]">{comp.nomenclature.traditional}</span>
                </div>

                {comp.nomenclature.common && (
                  <div className="py-1.5 grid grid-cols-[105px_1fr] gap-2 items-baseline">
                    <span className="font-mono text-[9.5px] uppercase tracking-wider text-[#857F72]">
                      Nombre usual
                    </span>
                    <span className="font-semibold text-[#1B3B6F]">{comp.nomenclature.common}</span>
                  </div>
                )}
              </div>

              {/* Brief Chemical Note */}
              <div className="px-3 py-2 bg-[#F5F2EA]/70 border-t border-[#E5E0D5] text-[11px] text-[#57534A] leading-relaxed">
                {comp.description}
              </div>
            </article>
          );
        })}
      </div>

      {/* Editorial Disclaimer Footer */}
      <div className="px-4 py-2.5 bg-[#EDE9DF] border-t border-[#1A1917] font-mono text-[9.5px] text-[#57534A] leading-snug">
        <strong className="text-[#1A1917] uppercase">Nota estequiométrica:</strong> Combinaciones
        calculadas por balance de estados de oxidación formales según reglas IUPAC. La estabilidad
        termodinámica depende de las condiciones de presión y temperatura.
      </div>
    </div>
  );
};
