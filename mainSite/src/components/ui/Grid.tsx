import React from 'react';

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  mdCols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  lgCols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: 'sm' | 'md' | 'lg' | 'xl' | number;
  children: React.ReactNode;
}

const getColsClasses = (cols: number) => {
  switch (cols) {
    case 1:
      return 'grid-cols-1';
    case 2:
      return 'grid-cols-1 md:grid-cols-2';
    case 3:
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    case 4:
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    case 5:
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5';
    case 6:
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6';
    case 12:
      return 'grid-cols-12';
    default:
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  }
};

const getGapClasses = (gap: string | number) => {
  if (typeof gap === 'number') {
    return `gap-${gap}`;
  }
  switch (gap) {
    case 'sm':
      return 'gap-2';
    case 'md':
      return 'gap-4';
    case 'lg':
      return 'gap-6';
    case 'xl':
      return 'gap-8';
    default:
      return 'gap-4';
  }
};

export const Grid = ({ 
  cols = 3, 
  mdCols,
  lgCols,
  gap = 'md', 
  children, 
  className = '',
  ...props 
}: GridProps) => {
  const colsClasses = getColsClasses(cols);
  const gapClasses = getGapClasses(gap);
  
  return (
    <div
      className={`grid ${colsClasses} ${gapClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
