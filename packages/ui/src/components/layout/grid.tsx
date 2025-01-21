import * as React from 'react';
import { cn } from '../../lib/utils';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  cols?: number | { sm?: number; md?: number; lg?: number; xl?: number };
  gap?: number | { x?: number; y?: number };
  flow?: 'row' | 'col';
}

const getGridCols = (cols: GridProps['cols']) => {
  if (typeof cols === 'number') {
    return `grid-cols-${cols}`;
  }
  if (typeof cols === 'object') {
    return cn(
      cols.sm && `sm:grid-cols-${cols.sm}`,
      cols.md && `md:grid-cols-${cols.md}`,
      cols.lg && `lg:grid-cols-${cols.lg}`,
      cols.xl && `xl:grid-cols-${cols.xl}`
    );
  }
  return '';
};

const getGridGap = (gap: GridProps['gap']) => {
  if (typeof gap === 'number') {
    return `gap-${gap}`;
  }
  if (typeof gap === 'object') {
    return cn(
      gap.x && `gap-x-${gap.x}`,
      gap.y && `gap-y-${gap.y}`
    );
  }
  return '';
};

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ as: Component = 'div', className, cols = 1, gap = 4, flow = 'row', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          'grid',
          flow === 'col' && 'grid-flow-col',
          getGridCols(cols),
          getGridGap(gap),
          className
        )}
        {...props}
      />
    );
  }
);

Grid.displayName = 'Grid'; 