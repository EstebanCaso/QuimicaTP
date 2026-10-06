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
    sm: 'px-2.5 py-1 text-xs font-medium gap-1.5 rounded-md',
    md: 'px-3.5 py-1.5 text-sm font-medium gap-2 rounded-md',
    lg: 'px-4 py-2 text-base font-medium gap-2.5 rounded-lg',
  }[size];

  const variantClasses = {
    primary:
      'bg-blue-600 text-white border border-blue-700 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
    secondary:
      'bg-white text-neutral-800 border border-neutral-300 hover:bg-neutral-100 focus:ring-2 focus:ring-neutral-400 focus:ring-offset-1 shadow-xs',
    ghost:
      'bg-transparent text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 focus:ring-2 focus:ring-neutral-300',
    danger:
      'bg-white text-red-700 border border-red-300 hover:bg-red-50 focus:ring-2 focus:ring-red-400 shadow-xs',
  }[variant];

  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer';

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
