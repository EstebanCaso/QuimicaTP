import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-2.5 py-1 text-[11px] font-medium tracking-wide gap-1.5 rounded-[2px]',
    md: 'px-3.5 py-1.5 text-xs font-medium tracking-wide gap-2 rounded-[2px]',
    lg: 'px-4 py-2 text-sm font-medium tracking-wide gap-2.5 rounded-[2px]',
  }[size];

  const variantClasses = {
    primary:
      'bg-[#1B3B6F] text-[#FCFBF7] border border-[#132A50] hover:bg-[#132A50] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#1B3B6F]',
    secondary:
      'bg-[#FCFBF7] text-[#1A1917] border border-[#B8B0A0] hover:bg-[#EDE9DF] hover:border-[#1A1917] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#1A1917]',
    ghost:
      'bg-transparent text-[#57534A] border border-transparent hover:bg-[#EDE9DF] hover:text-[#1A1917] focus-visible:outline-2 focus-visible:outline-[#857F72]',
    danger:
      'bg-[#FCFBF7] text-[#9E2A2B] border border-[#C99696] hover:bg-[#F7E8E8] hover:border-[#9E2A2B] focus-visible:outline-2 focus-visible:outline-[#9E2A2B]',
  }[variant];

  const disabledClass = disabled ? 'opacity-45 cursor-not-allowed pointer-events-none' : 'cursor-pointer';

  return (
    <button
      className={`inline-flex items-center justify-center transition-colors duration-150 select-none ${sizeClasses} ${variantClasses} ${disabledClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
