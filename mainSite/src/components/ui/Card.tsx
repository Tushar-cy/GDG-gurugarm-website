import React from 'react';
import { ReactNode } from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass' | 'subtle';
  hover?: boolean;
  children: ReactNode;
}

const getVariantClasses = (variant: string, hover: boolean) => {
  const baseClasses = 'rounded-xl transition-all duration-200 relative overflow-hidden';
  const hoverClasses = hover ? 'hover:-translate-y-1' : '';
  
  switch (variant) {
    case 'default':
      return `${baseClasses} ${hoverClasses} bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-200`;
    case 'elevated':
      return `${baseClasses} ${hoverClasses} bg-white border border-gray-200 shadow-md hover:shadow-xl hover:border-blue-300`;
    case 'outlined':
      return `${baseClasses} ${hoverClasses} bg-transparent border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300`;
    case 'glass':
      return `${baseClasses} ${hoverClasses} bg-white/70 backdrop-blur-md border border-white/30 shadow-md hover:bg-white/80 hover:shadow-lg`;
    case 'subtle':
      return `${baseClasses} ${hoverClasses} bg-slate-50 border border-slate-200 shadow-sm hover:bg-slate-100 hover:border-slate-300 hover:shadow-md`;
    default:
      return `${baseClasses} ${hoverClasses} bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-200`;
  }
};

export const Card = ({ 
  variant = 'default', 
  hover = true, 
  children, 
  className = '',
  ...props 
}: CardProps) => {
  const variantClasses = getVariantClasses(variant, hover);
  
  return (
    <div
      className={`${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};