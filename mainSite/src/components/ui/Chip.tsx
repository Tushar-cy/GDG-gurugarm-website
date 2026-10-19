import React from 'react';

interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  selected?: boolean;
  children: React.ReactNode;
}

const getVariantClasses = (variant: string, selected: boolean) => {
  const baseClasses = 'inline-flex items-center rounded-full font-medium transition-all duration-200';
  
  switch (variant) {
    case 'primary':
      return `${baseClasses} ${selected 
        ? 'bg-blue-600 text-white shadow-md' 
        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`;
    case 'secondary':
      return `${baseClasses} ${selected 
        ? 'bg-slate-600 text-white shadow-md' 
        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`;
    default:
      return `${baseClasses} ${selected 
        ? 'bg-gray-600 text-white shadow-md' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`;
  }
};

const getSizeClasses = (size: string) => {
  switch (size) {
    case 'sm':
      return 'px-2 py-1 text-xs';
    case 'md':
      return 'px-3 py-1.5 text-sm';
    case 'lg':
      return 'px-4 py-2 text-base';
    default:
      return 'px-3 py-1.5 text-sm';
  }
};

export const Chip = ({ 
  variant = 'default', 
  size = 'md', 
  selected = false,
  children, 
  className = '',
  ...props 
}: ChipProps) => {
  const variantClasses = getVariantClasses(variant, selected);
  const sizeClasses = getSizeClasses(size);
  
  return (
    <div
      className={`${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
