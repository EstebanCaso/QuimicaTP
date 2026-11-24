import React from 'react';
import { X } from 'lucide-react';

export interface ChipProps {
  label: string;
  sublabel?: string;
  onRemove?: () => void;
  onClick?: () => void;
  color?: string;
  isActive?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  sublabel,
  onRemove,
  onClick,
  color,
  isActive = false,
}) => {
  return (
    <span
      onClick={onClick}
      style={color ? { backgroundColor: color } : undefined}
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs rounded-[2px] border transition-colors ${
        isActive
          ? 'border-[#1A1917] ring-1 ring-[#1A1917] text-[#1A1917] font-semibold'
          : color
          ? 'border-[#ACA493] text-[#1A1917]'
          : 'bg-[#FCFBF7] border-[#C8C1B2] text-[#1A1917] hover:bg-[#EDE9DF]'
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      <span className="font-mono font-semibold">{label}</span>
      {sublabel && <span className="text-[#57534A] text-[11px]">{sublabel}</span>}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 p-0.5 text-[#57534A] hover:text-[#1A1917] hover:bg-black/10 cursor-pointer transition-colors"
          title="Quitar"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};
