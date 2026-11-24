import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  badge?: number | string;
  icon?: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ items, activeId, onChange, className = '' }) => {
  return (
    <div className={`flex border-b border-[#D5CFC2] bg-[#EDE9DF] overflow-x-auto ${className}`}>
      {items.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs border-r border-[#D5CFC2] whitespace-nowrap transition-colors cursor-pointer select-none ${
              isActive
                ? 'bg-[#FCFBF7] text-[#1A1917] font-semibold border-b-2 border-b-[#1B3B6F] -mb-px'
                : 'bg-transparent text-[#57534A] hover:text-[#1A1917] hover:bg-[#F5F2EA]'
            }`}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span className="font-mono">{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`ml-1 px-1.5 py-0.5 font-mono text-[10px] ${
                  isActive ? 'bg-[#1B3B6F] text-[#FCFBF7]' : 'bg-[#D5CFC2] text-[#1A1917]'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
