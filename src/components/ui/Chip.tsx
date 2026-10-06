import React from 'react';
import { X } from 'lucide-react';

export interface ChipProps {
  label: string;
  sublabel?: string;
  onRemove?: () => void;
  onClick?: () => void;
  color?: string; // Optional hex background
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
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border transition-all ${
        color
          ? 'border-neutral-300 text-neutral-800'
          : isActive
          ? 'bg-blue-50 border-blue-400 text-blue-900 font-semibold'
          : 'bg-white border-neutral-300 text-neutral-800 hover:bg-neutral-50'
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      <span className="font-bold">{label}</span>
      {sublabel && <span className="text-neutral-500 font-normal">{sublabel}</span>}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 p-0.5 rounded text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/50 cursor-pointer transition-colors"
          title="Quitar"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};
