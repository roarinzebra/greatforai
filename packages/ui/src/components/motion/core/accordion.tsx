'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, Transition, TargetAndTransition } from 'framer-motion';

export interface AccordionProps {
  children: React.ReactNode;
  className?: string;
  transition?: Transition;
  variants?: {
    expanded: TargetAndTransition;
    collapsed: TargetAndTransition;
  };
  expandedValue?: React.Key | null;
  onValueChange?: (value: React.Key | null) => void;
}

interface AccordionContextValue {
  expandedValue: React.Key | null;
  onValueChange: (value: React.Key | null) => void;
  transition?: Transition;
  variants: {
    expanded: TargetAndTransition;
    collapsed: TargetAndTransition;
  };
}

const defaultVariants = {
  expanded: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: {
        duration: 0.2,
      },
      opacity: {
        duration: 0.15,
      },
    },
  },
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      height: {
        duration: 0.2,
      },
      opacity: {
        duration: 0.15,
      },
    },
  },
} as const;

const AccordionContext = React.createContext<AccordionContextValue>({
  expandedValue: null,
  onValueChange: () => undefined,
  variants: defaultVariants,
});

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    { children, className, transition, variants = defaultVariants, expandedValue: controlledValue, onValueChange },
    ref
  ): React.JSX.Element => {
    const [internalValue, setInternalValue] = React.useState<React.Key | null>(null);

    const contextValue = React.useMemo(
      () => ({
        expandedValue: controlledValue ?? internalValue,
        onValueChange: (newValue: React.Key | null): void => {
          if (controlledValue === undefined) {
            setInternalValue(newValue);
          }
          onValueChange?.(newValue);
        },
        transition,
        variants,
      }),
      [controlledValue, internalValue, onValueChange, transition, variants]
    );

    return (
      <AccordionContext.Provider value={contextValue}>
        <div ref={ref} className={cn('space-y-1', className)}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);

interface AccordionItemProps {
  value: React.Key;
  children: React.ReactNode;
  className?: string;
}

interface AccordionItemContextValue {
  value: React.Key;
}

const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(null);

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value: itemValue, children, className }, ref): React.JSX.Element => {
    const { expandedValue } = React.useContext(AccordionContext);
    const isExpanded = expandedValue === itemValue;

    const itemContextValue = React.useMemo(
      () => ({ value: itemValue }),
      [itemValue]
    );

    return (
      <AccordionItemContext.Provider value={itemContextValue}>
        <div
          ref={ref}
          className={cn('border rounded-lg', className)}
          data-state={isExpanded ? 'expanded' : 'collapsed'}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  }
);

interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
}

export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ children, className }, ref): React.JSX.Element => {
    const { expandedValue, onValueChange } = React.useContext(AccordionContext);
    const itemContext = React.useContext(AccordionItemContext);

    if (!itemContext) {
      throw new Error('AccordionTrigger must be used within an AccordionItem');
    }

    const { value: triggerValue } = itemContext;
    const isExpanded = expandedValue === triggerValue;

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'flex w-full items-center justify-between px-4 py-2 font-medium transition-all hover:underline',
          className
        )}
        onClick={(): void => onValueChange(isExpanded ? null : triggerValue)}
        aria-expanded={isExpanded}
      >
        {children}
        <motion.span
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="h-4 w-4"
        >
          ↓
        </motion.span>
      </button>
    );
  }
);

interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
}

export const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ children, className }, ref): React.JSX.Element => {
    const { expandedValue, variants } = React.useContext(AccordionContext);
    const itemContext = React.useContext(AccordionItemContext);

    if (!itemContext) {
      throw new Error('AccordionContent must be used within an AccordionItem');
    }

    const { value: contentValue } = itemContext;
    const isExpanded = expandedValue === contentValue;

    return (
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            ref={ref}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={variants}
            className={cn('overflow-hidden', className)}
          >
            <div className="px-4 py-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

Accordion.displayName = 'Accordion';
AccordionItem.displayName = 'AccordionItem';
AccordionTrigger.displayName = 'AccordionTrigger';
AccordionContent.displayName = 'AccordionContent'; 