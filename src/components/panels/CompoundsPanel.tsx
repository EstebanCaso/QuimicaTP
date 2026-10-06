import React, { useState, useMemo } from 'react';
import { X, Copy, Check, FlaskConical, Search, Info, ShieldAlert, Sparkles } from 'lucide-react';
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

  // Unique types present in current results
  const availableTypes = useMemo(() => {
    const types = new Set<CompoundType>();
    for (const c of result.compounds) {
      types.add(c.type);
    }
    return Array.from(types);
  }, [result.compounds]);

  return (
    <div className="w-full md:w-[460px] lg:w-[500px] h-full bg-white border-l border-neutral-200 flex flex-col shadow-lg z-20 overflow-hidden">
      {/* Top Header */}
      <div className="p-3 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded border border-blue-200 bg-blue-50 text-blue-700 flex items-center justify-center">
            <FlaskConical className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-neutral-900 leading-tight">
              Compuestos Posibles
            </h2>
            <div className="text-[11px] text-neutral-500">
              Elementos: <span className="font-semibold text-neutral-800">{selectedSymbols.join(' + ')}</span> · {result.compounds.length} combinaciones
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

      {/* Filter and Search Bar inside panel */}
      {result.compounds.length > 0 && (
        <div className="p-2.5 border-b border-neutral-200 bg-white space-y-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Buscar por fórmula o nombre..."
              className="w-full pl-8 pr-2.5 py-1 text-xs rounded-md border border-neutral-300 bg-neutral-50 text-neutral-800 placeholder-neutral-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          {availableTypes.length > 1 && (
            <div className="flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => setSelectedType('all')}
                className={`px-2 py-0.5 text-[11px] font-medium rounded border cursor-pointer transition-colors ${
                  selectedType === 'all'
                    ? 'bg-blue-600 text-white border-blue-700'
                    : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                Todos ({result.compounds.length})
              </button>
              {availableTypes.map((t) => {
                const count = result.compounds.filter((c) => c.type === t).length;
                const sample = result.compounds.find((c) => c.type === t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedType(t)}
                    className={`px-2 py-0.5 text-[11px] font-medium rounded border cursor-pointer transition-colors ${
                      selectedType === t
                        ? 'bg-blue-600 text-white border-blue-700'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    {sample?.typeLabel || t} ({count})
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Noble Gases Alert */}
        {result.isInert && (
          <div className="p-4 rounded-lg border border-purple-200 bg-purple-50 text-purple-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Inercia Química de Gases Nobles</span>
            </div>
            <p className="text-xs leading-relaxed text-neutral-700">{result.message}</p>
          </div>
        )}

        {/* Pure Metal Alloy Alert */}
        {result.isAlloyOnly && (
          <div className="p-4 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs">
              <ShieldAlert className="w-4 h-4 text-slate-700" />
              <span>Enlace Metálico y Aleaciones</span>
            </div>
            <p className="text-xs leading-relaxed text-neutral-700">{result.message}</p>
          </div>
        )}

        {/* No compounds found */}
        {!result.isInert && !result.isAlloyOnly && filteredCompounds.length === 0 && (
          <div className="text-center py-10 text-neutral-500 text-xs space-y-1">
            <Info className="w-6 h-6 mx-auto text-neutral-400 mb-2" />
            <p className="font-medium text-neutral-700">No se encontraron compuestos coincidentes</p>
            <p className="text-neutral-500">Prueba ajustando los filtros de búsqueda.</p>
          </div>
        )}

        {/* List of Compound Cards */}
        {filteredCompounds.map((comp) => {
          const isCopied = copiedId === comp.id;

          return (
            <div
              key={comp.id}
              className="p-3 rounded-lg border border-neutral-200 bg-white hover:border-neutral-300 transition-colors shadow-2xs space-y-2.5"
            >
              {/* Formula & Copy Button */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xl font-bold font-mono text-neutral-900 tracking-tight">
                    {comp.formulaFormatted}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-neutral-100 text-neutral-700 border border-neutral-200">
                      {comp.typeLabel}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                        comp.bondType === 'ionico'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {comp.bondType === 'ionico' ? 'Enlace Iónico' : 'Enlace Covalente'}
                    </span>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant={isCopied ? 'primary' : 'secondary'}
                  onClick={() => handleCopy(comp.formulaFormatted, comp.id)}
                  title="Copiar fórmula química"
                  icon={isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                >
                  <span className="text-[11px]">{isCopied ? 'Copiado' : 'Copiar'}</span>
                </Button>
              </div>

              {/* Triple Nomenclature Block */}
              <div className="bg-neutral-50 rounded-md p-2.5 border border-neutral-200 text-xs space-y-1.5">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                    Nomenclatura Sistemática (IUPAC)
                  </span>
                  <span className="font-semibold text-neutral-900">{comp.nomenclature.systematic}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                    Nomenclatura Stock
                  </span>
                  <span className="text-neutral-800">{comp.nomenclature.stock}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                    Nomenclatura Tradicional
                  </span>
                  <span className="text-neutral-800 italic">{comp.nomenclature.traditional}</span>
                </div>

                {comp.nomenclature.common && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                      Nombre común / habitual
                    </span>
                    <span className="text-blue-800 font-medium">{comp.nomenclature.common}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-[11px] text-neutral-600 leading-relaxed">{comp.description}</p>
            </div>
          );
        })}
      </div>

      {/* Discreet Disclaimer Footer */}
      <div className="p-2.5 bg-neutral-100/70 border-t border-neutral-200 text-[10px] text-neutral-500 leading-snug">
        <strong>Aviso pedagógico:</strong> Las fórmulas mostradas son combinaciones teóricas derivadas
        de los estados de oxidación conocidos y reglas estequiométricas de la IUPAC. No todas las
        especies son estables o aislables en condiciones ambientales ordinarias.
      </div>
    </div>
  );
};
