import * as React from 'react';
import { cn } from '../../lib/utils';

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  spacing?: number | { sm?: number; md?: number; lg?: number; xl?: number };
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
}

const getSpacing = (spacing: StackProps['spacing']) => {
  if (typeof spacing === 'number') {
    return `space-y-${spacing}`;
  }
  if (typeof spacing === 'object') {
    return cn(
      spacing.sm && `sm:space-y-${spacing.sm}`,
      spacing.md && `md:space-y-${spacing.md}`,
      spacing.lg && `lg:space-y-${spacing.lg}`,
      spacing.xl && `xl:space-y-${spacing.xl}`
    );
  }
  return '';
};

const alignmentMap = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

const justifyMap = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
};

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ 
    as: Component = 'div', 
    className, 
    spacing = 4, 
    align = 'stretch',
    justify = 'start',
    ...props 
  }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          'flex flex-col',
          getSpacing(spacing),
          alignmentMap[align],
          justifyMap[justify],
          className
        )}
        {...props}
      />
    );
  }
);

Stack.displayName = 'Stack'; 