import React, { useMemo } from 'react';
import { ElementRepository } from '../../domain/elements/element-repository';
import {
  CATEGORIES_META,
  GROUP_CAS_LABELS,
  GROUP_TOP_PERIOD,
  PHASES_META,
  getElementCoordinates,
} from '../../domain/elements/element-metadata';
import { usePeriodicStore } from '../../store/usePeriodicStore';

const GROUPS = Array.from({ length: 18 }, (_, i) => i + 1);
const PERIODS = [1, 2, 3, 4, 5, 6, 7];

export const PeriodicTable2D: React.FC = () => {
  const allElements = useMemo(() => ElementRepository.getAllElements(), []);

  const selectedSymbols = usePeriodicStore((s) => s.selectedSymbols);
  const activeTabSymbol = usePeriodicStore((s) => s.activeTabSymbol);
  const toggleElement = usePeriodicStore((s) => s.toggleElement);
  const hoveredElement = usePeriodicStore((s) => s.hoveredElement);
  const setHoveredElement = usePeriodicStore((s) => s.setHoveredElement);

  const categoryFilter = usePeriodicStore((s) => s.categoryFilter);
  const blockFilter = usePeriodicStore((s) => s.blockFilter);
  const phaseFilter = usePeriodicStore((s) => s.phaseFilter);
  const searchQuery = usePeriodicStore((s) => s.searchQuery);

  const filteredSet = useMemo(() => {
    const matching = ElementRepository.filterElements({
      category: categoryFilter,
      block: blockFilter,
      phase: phaseFilter,
      search: searchQuery,
    });
    return new Set(matching.map((e) => e.symbol));
  }, [categoryFilter, blockFilter, phaseFilter, searchQuery]);

  // Specimen shown in the classical upper-trench Key Box (hover -> active selected -> Fe default)
  const keySpecimen = useMemo(() => {
    if (hoveredElement) return hoveredElement;
    if (activeTabSymbol) {
      const active = ElementRepository.getBySymbol(activeTabSymbol);
      if (active) return active;
    }
    return ElementRepository.getBySymbol('Fe') || allElements[0];
  }, [hoveredElement, activeTabSymbol, allElements]);

  const keyCatMeta = CATEGORIES_META[keySpecimen.category] || CATEGORIES_META.unknown;

  return (
    <div className="w-full h-full overflow-auto p-3 sm:p-5 flex items-start xl:items-center justify-center bg-[#F5F2EA]">
      <div
        className="grid gap-[2px] min-w-[980px] max-w-[1440px] w-full select-none"
        style={{
          gridTemplateColumns: '26px repeat(18, minmax(0, 1fr))',
          gridTemplateRows: '26px repeat(7, minmax(54px, 1fr)) 10px repeat(2, minmax(54px, 1fr))',
        }}
      >
        {/* Top-left corner label */}
        <div
          style={{ gridColumnStart: 1, gridRowStart: 1 }}
          className="flex items-end justify-center pb-0.5 font-mono text-[8px] uppercase text-[#857F72]"
        >
          P\G
        </div>

        {/* Stepped Group Headers (1..18 + IA..VIIIA) */}
        {GROUPS.map((g) => {
          const topPeriod = GROUP_TOP_PERIOD[g] || 4;
          const headerRow = topPeriod; // Since period p is at row p+1, row=topPeriod sits right above it
          return (
            <div
              key={`g-hdr-${g}`}
              style={{ gridColumnStart: g + 1, gridRowStart: headerRow }}
              className="flex flex-col items-center justify-end pb-1 leading-none font-mono"
            >
              <span className="text-[11px] font-bold text-[#1A1917]">{g}</span>
              <span className="text-[8px] text-[#787163]">{GROUP_CAS_LABELS[g]}</span>
            </div>
          );
        })}

        {/* Period Margin Numbers (1..7) */}
        {PERIODS.map((p) => (
          <div
            key={`p-hdr-${p}`}
            style={{ gridColumnStart: 1, gridRowStart: p + 1 }}
            className="flex items-center justify-center font-mono text-xs font-bold text-[#57534A]"
          >
            {p}
          </div>
        ))}

        {/* Classical Wall-Chart Specimen Key Box in the open d-block trench (Groups 3-12, Rows 1-3) */}
        <div
          style={{ gridColumn: '4 / 14', gridRow: '1 / 4' }}
          className="mx-2 my-0.5 border border-[#C8C1B2] bg-[#FCFBF7] px-4 py-2.5 flex items-center justify-between gap-4"
        >
          {/* Enlarged Periodic Cell */}
          <div className="flex items-center gap-3.5">
            <div
              style={{
                backgroundColor: keyCatMeta.color,
                borderColor: '#1A1917',
              }}
              className="w-24 h-28 border-[1.5px] p-1.5 flex flex-col justify-between shrink-0 relative"
            >
              <div className="flex justify-between items-start font-mono text-[11px] leading-none text-[#1A1917]">
                <span className="font-bold">{keySpecimen.number}</span>
                <span className="text-[10px] text-[#57534A]">{keySpecimen.atomicMass}</span>
              </div>
              <div className="my-auto flex items-center justify-between">
                <span className="text-3xl font-bold tracking-tight text-[#1A1917] leading-none pl-1">
                  {keySpecimen.symbol}
                </span>
                <div className="flex flex-col items-end font-mono text-[8px] leading-tight text-[#57534A]">
                  {keySpecimen.oxidationStates.slice(0, 4).map((ox) => (
                    <span key={ox}>{ox > 0 ? `+${ox}` : ox}</span>
                  ))}
                </div>
              </div>
              <div className="border-t border-[#1A1917]/20 pt-0.5 text-center">
                <div className="text-[10px] font-semibold text-[#1A1917] truncate leading-tight">
                  {keySpecimen.name}
                </div>
                <div className="font-mono text-[8px] text-[#57534A] truncate leading-none mt-0.5">
                  {keySpecimen.electronConfiguration}
                </div>
              </div>
            </div>

            {/* Key Callout Legend */}
            <div className="space-y-1 font-mono text-[10px] text-[#57534A]">
              <div className="uppercase tracking-widest text-[9px] text-[#857F72] font-semibold">
                Casilla de Referencia · {keyCatMeta.label}
              </div>
              <div className="text-sm font-serif font-semibold text-[#1A1917]">
                {keySpecimen.name}{' '}
                <span className="italic font-normal text-xs text-[#57534A]">
                  ({keySpecimen.nameEn})
                </span>
              </div>
              <div>
                Grupo {keySpecimen.group} ({GROUP_CAS_LABELS[keySpecimen.group]}) · Período{' '}
                {keySpecimen.period} · Bloque {keySpecimen.block}
              </div>
              <div>
                Estado a 25 °C: <strong className="text-[#1A1917]">{PHASES_META[keySpecimen.phase].label}</strong>
                {keySpecimen.electronegativity !== null && (
                  <> · χ = <strong className="text-[#1A1917]">{keySpecimen.electronegativity}</strong></>
                )}
              </div>
            </div>
          </div>

          {/* Right side: Printed Key Legend */}
          <div className="hidden xl:flex flex-col justify-center border-l border-[#D5CFC2] pl-4 font-mono text-[9px] text-[#57534A] space-y-1 shrink-0">
            <div className="uppercase tracking-wider text-[#1A1917] font-semibold">
              Nomenclatura de Celda
            </div>
            <div>Sup. Izq.: Número atómico (Z)</div>
            <div>Sup. Der.: Masa atómica estándar (u)</div>
            <div>Columna Der.: Estados de oxidación</div>
            <div>Pie: Nombre oficial IUPAC</div>
          </div>
        </div>

        {/* 118 Element Cells */}
        {allElements.map((el) => {
          const coords = getElementCoordinates(el.number, el.period, el.group);
          const isLanthanide = el.number >= 57 && el.number <= 71;
          const isActinide = el.number >= 89 && el.number <= 103;

          const gridCol = Math.round(coords.x) + 1;
          const gridRow = isLanthanide ? 10 : isActinide ? 11 : el.period + 1;

          const isSelected = selectedSymbols.includes(el.symbol);
          const isHovered = hoveredElement?.symbol === el.symbol;
          const isFilteredOut = !filteredSet.has(el.symbol);
          const catMeta = CATEGORIES_META[el.category] || CATEGORIES_META.unknown;

          return (
            <button
              key={el.number}
              type="button"
              onClick={() => toggleElement(el.symbol)}
              onMouseEnter={() => setHoveredElement(el)}
              onMouseLeave={() => isHovered && setHoveredElement(null)}
              onFocus={() => setHoveredElement(el)}
              onBlur={() => isHovered && setHoveredElement(null)}
              style={{
                gridColumnStart: gridCol,
                gridRowStart: gridRow,
                backgroundColor: isFilteredOut ? '#ECE8DE' : catMeta.color,
                borderColor: isSelected
                  ? '#1B3B6F'
                  : isHovered
                  ? '#1A1917'
                  : catMeta.borderColor,
                opacity: isFilteredOut ? 0.28 : 1,
              }}
              className={`flex flex-col justify-between p-1 border text-left transition-colors duration-100 relative cursor-pointer ${
                isSelected
                  ? 'ring-2 ring-[#1A1917] z-10'
                  : 'hover:z-10'
              }`}
              aria-label={`${el.name}, número atómico ${el.number}, símbolo ${el.symbol}`}
            >
              <div className="flex justify-between items-center font-mono text-[9px] leading-none text-[#1A1917]">
                <span className="font-bold">{el.number}</span>
                <span className="text-[8px] text-[#57534A]">
                  {el.atomicMass < 100 ? el.atomicMass.toFixed(1) : Math.round(el.atomicMass)}
                </span>
              </div>
              <div
                className={`text-sm sm:text-base font-bold text-center leading-none my-0.5 tracking-tight ${
                  isSelected ? 'text-[#1B3B6F]' : 'text-[#1A1917]'
                }`}
              >
                {el.symbol}
              </div>
              <div className="text-[8.5px] text-center text-[#3A3731] truncate leading-none font-medium">
                {el.name}
              </div>
            </button>
          );
        })}

        {/* Lanthanide Callout Placeholder in Period 6, Group 3 */}
        <div
          style={{ gridColumnStart: 4, gridRowStart: 7 }}
          className="flex flex-col items-center justify-center p-1 border border-[#CFA8B8] bg-[#F0D9E2]/80 font-mono text-[#66243F]"
        >
          <span className="text-[10px] font-bold">57–71 *</span>
          <span className="text-[8px]">La–Lu</span>
        </div>

        {/* Actinide Callout Placeholder in Period 7, Group 3 */}
        <div
          style={{ gridColumnStart: 4, gridRowStart: 8 }}
          className="flex flex-col items-center justify-center p-1 border border-[#C3A6CC] bg-[#E8D8EC]/80 font-mono text-[#522661]"
        >
          <span className="text-[10px] font-bold">89–103 **</span>
          <span className="text-[8px]">Ac–Lr</span>
        </div>

        {/* F-Block Row Prefix Labels */}
        <div
          style={{ gridColumn: '2 / 4', gridRowStart: 10 }}
          className="flex items-center justify-end pr-2 font-mono text-[10px] font-semibold text-[#66243F]"
        >
          * Lantánidos
        </div>
        <div
          style={{ gridColumn: '2 / 4', gridRowStart: 11 }}
          className="flex items-center justify-end pr-2 font-mono text-[10px] font-semibold text-[#522661]"
        >
          ** Actínidos
        </div>
      </div>
    </div>
  );
};
