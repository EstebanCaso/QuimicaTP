import React, { useMemo } from 'react';
import { ElementRepository } from '../../domain/elements/element-repository';
import { CATEGORIES_META, getElementCoordinates } from '../../domain/elements/element-metadata';
import { usePeriodicStore } from '../../store/usePeriodicStore';

export const PeriodicTable2D: React.FC = () => {
  const allElements = useMemo(() => ElementRepository.getAllElements(), []);

  const selectedSymbols = usePeriodicStore((s) => s.selectedSymbols);
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

  return (
    <div className="w-full h-full overflow-auto p-4 flex items-center justify-center bg-[#FAFAFA]">
      <div
        className="grid gap-1 min-w-[900px] max-w-[1300px] w-full"
        style={{
          gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
          gridTemplateRows: 'repeat(10, minmax(0, 1fr))',
        }}
      >
        {allElements.map((el) => {
          const coords = getElementCoordinates(el.number, el.period, el.group);
          const gridCol = Math.round(coords.x);
          const gridRow = Math.round(coords.y);

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
                backgroundColor: isFilteredOut ? '#F4F4F5' : catMeta.color,
                borderColor: isSelected ? '#2563EB' : isHovered ? '#71717A' : catMeta.borderColor,
                opacity: isFilteredOut ? 0.25 : 1,
              }}
              className={`flex flex-col justify-between p-1 rounded border text-left transition-all duration-150 relative cursor-pointer ${
                isSelected
                  ? 'ring-2 ring-blue-600 ring-offset-1 z-10 shadow-sm'
                  : 'hover:shadow-xs hover:z-10'
              }`}
              aria-label={`${el.name}, número atómico ${el.number}, símbolo ${el.symbol}`}
            >
              <div className="flex justify-between items-center text-[10px] leading-none text-neutral-600 font-medium">
                <span>{el.number}</span>
                <span className="text-[9px] text-neutral-400">
                  {el.atomicMass < 100 ? el.atomicMass.toFixed(1) : Math.round(el.atomicMass)}
                </span>
              </div>
              <div
                className={`text-sm sm:text-base font-bold text-center leading-none my-0.5 ${
                  isSelected ? 'text-blue-700' : 'text-neutral-900'
                }`}
              >
                {el.symbol}
              </div>
              <div className="text-[9px] text-center text-neutral-600 truncate leading-none">
                {el.name}
              </div>
            </button>
          );
        })}

        {/* Lanthanide placeholder */}
        <div
          style={{ gridColumnStart: 3, gridRowStart: 6 }}
          className="flex flex-col items-center justify-center p-1 rounded border border-pink-200 bg-pink-50 text-[10px] text-pink-700 font-semibold"
        >
          <span>57-71</span>
          <span className="text-[8px]">La-Lu</span>
        </div>

        {/* Actinide placeholder */}
        <div
          style={{ gridColumnStart: 3, gridRowStart: 7 }}
          className="flex flex-col items-center justify-center p-1 rounded border border-purple-200 bg-purple-50 text-[10px] text-purple-700 font-semibold"
        >
          <span>89-103</span>
          <span className="text-[8px]">Ac-Lr</span>
        </div>
      </div>
    </div>
  );
};
