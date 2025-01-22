import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '../../lib/utils';

export interface LabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  error?: boolean;
  optional?: boolean;
}

export const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, error, optional, children, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed',
      'peer-disabled:opacity-70',
      error ? 'text-destructive' : 'text-foreground',
      className
    )}
    {...props}
  >
    {children}
    {optional && (
      <span className="ml-1 text-muted-foreground">(Optional)</span>
    )}
  </LabelPrimitive.Root>
));

Label.displayName = 'Label'; 