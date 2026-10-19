import React from 'react';
import { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const getVariantClasses = (variant: string) => {
  switch (variant) {
    case 'primary':
      return 'bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200';
    case 'secondary':
      return 'bg-slate-600 text-white shadow-lg hover:bg-slate-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200';
    case 'ghost':
      return 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-700 hover:-translate-y-0.5 transition-all duration-200';
    case 'outline':
      return 'bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200';
    case 'gradient':
      return 'bg-gradient-to-r from-blue-600 to-slate-600 text-white shadow-lg hover:from-blue-700 hover:to-slate-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200';
    default:
      return 'bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200';
  }
};

const getSizeClasses = (size: string) => {
  switch (size) {
    case 'sm':
      return 'px-4 py-2 text-sm';
    case 'md':
      return 'px-6 py-3 text-base';
    case 'lg':
      return 'px-8 py-4 text-lg';
    default:
      return 'px-6 py-3 text-base';
  }
};

export const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '',
  disabled,
  ...props 
}: ButtonProps) => {
  const baseClasses = 'rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
  const variantClasses = getVariantClasses(variant);
  const sizeClasses = getSizeClasses(size);
  const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed transform-none' : '';
  
  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};