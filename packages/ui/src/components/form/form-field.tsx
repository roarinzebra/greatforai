import * as React from 'react';
import { Input, type InputProps } from './input';
import { Label, type LabelProps } from './label';
import { cn } from '../../lib/utils';

export interface FormFieldProps extends InputProps {
  label?: string;
  labelProps?: Omit<LabelProps, 'error'>;
  error?: boolean;
  helperText?: string;
  containerClassName?: string;
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ 
    label,
    labelProps,
    error,
    helperText,
    containerClassName,
    id,
    ...props 
  }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className={cn('space-y-2', containerClassName)}>
        {label && (
          <Label
            htmlFor={inputId}
            error={error}
            {...labelProps}
          >
            {label}
          </Label>
        )}
        <Input
          id={inputId}
          error={error}
          helperText={helperText}
          aria-describedby={helperText ? `${inputId}-description` : undefined}
          ref={ref}
          {...props}
        />
        {helperText && (
          <p
            id={`${inputId}-description`}
            className={cn(
              'text-sm',
              error ? 'text-destructive' : 'text-muted-foreground'
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField'; 