import React from 'react';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | 'full';
  children: React.ReactNode;
}

const getMaxWidthClasses = (maxWidth: string) => {
  switch (maxWidth) {
    case 'sm':
      return 'max-w-sm';
    case 'md':
      return 'max-w-md';
    case 'lg':
      return 'max-w-lg';
    case 'xl':
      return 'max-w-xl';
    case '2xl':
      return 'max-w-2xl';
    case '4xl':
      return 'max-w-4xl';
    case '6xl':
      return 'max-w-6xl';
    case 'full':
      return 'max-w-full';
    default:
      return 'max-w-7xl';
  }
};

export const Container = ({ 
  maxWidth = '2xl', 
  children, 
  className = '',
  ...props 
}: ContainerProps) => {
  const maxWidthClasses = getMaxWidthClasses(maxWidth);
  
  return (
    <div
      className={`mx-auto px-4 ${maxWidthClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
