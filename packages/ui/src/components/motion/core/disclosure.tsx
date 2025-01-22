'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, Transition, TargetAndTransition } from 'framer-motion';

export interface DisclosureProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  variants?: {
    expanded: TargetAndTransition;
    collapsed: TargetAndTransition;
  };
  transition?: Transition;
}

const defaultVariants: {
  expanded: TargetAndTransition;
  collapsed: TargetAndTransition;
} = {
  expanded: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: {
        duration: 0.2,
        ease: 'easeOut',
      },
      opacity: {
        duration: 0.15,
        ease: 'easeIn',
      },
    },
  },
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      height: {
        duration: 0.2,
        ease: 'easeIn',
      },
      opacity: {
        duration: 0.15,
        ease: 'easeOut',
      },
    },
  },
};

const DisclosureContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>({
  open: false,
  onOpenChange: () => {},
});

export function Disclosure({ 
  children, 
  className, 
  style, 
  open = false, 
  onOpenChange, 
  variants = defaultVariants, 
  transition 
}: DisclosureProps): React.ReactElement {
  const value = React.useMemo(
    () => ({ open, onOpenChange: onOpenChange ?? (() => {}), variants, transition }),
    [open, onOpenChange, variants, transition]
  );

  return (
    <DisclosureContext.Provider value={value}>
      <div className={cn('relative', className)} style={style}>
        {children}
      </div>
    </DisclosureContext.Provider>
  );
}

export interface DisclosureTriggerProps {
  children: React.ReactNode;
  className?: string;
}

export function DisclosureTrigger({ children, className }: DisclosureTriggerProps): React.ReactElement {
  const { open, onOpenChange } = React.useContext(DisclosureContext);
  
  return (
    <button
      type="button"
      className={cn('w-full text-left', className)}
      onClick={() => onOpenChange(!open)}
      aria-expanded={open}
    >
      {children}
    </button>
  );
}

export interface DisclosureContentProps {
  children: React.ReactNode;
  className?: string;
}

export function DisclosureContent({ children, className }: DisclosureContentProps): React.ReactElement {
  const { open } = React.useContext(DisclosureContext);
  
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial="collapsed"
          animate="expanded"
          exit="collapsed"
          className={cn('overflow-hidden', className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

Disclosure.displayName = 'Disclosure';
DisclosureTrigger.displayName = 'DisclosureTrigger';
DisclosureContent.displayName = 'DisclosureContent'; 