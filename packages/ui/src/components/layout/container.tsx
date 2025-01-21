import * as React from 'react';
import { cn } from '../../lib/utils';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  centered?: boolean;
}

const maxWidthMap = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  full: 'max-w-full',
};

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ as: Component = 'div', className, maxWidth = '2xl', centered = true, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          'w-full px-4 mx-auto',
          maxWidthMap[maxWidth],
          centered && 'flex flex-col items-center',
          className
        )}
        {...props}
      />
    );
  }
);

Container.displayName = 'Container'; 