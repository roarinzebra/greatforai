'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, Transition, TargetAndTransition } from 'framer-motion';

export interface DisclosureProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
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
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}>({
  isOpen: false,
  onOpenChange: () => {},
});

export function Disclosure({ 
  children, 
  className, 
  style, 
  isOpen = false, 
  onOpenChange, 
  variants = defaultVariants, 
  transition 
}: DisclosureProps): React.ReactElement {
  const value = React.useMemo(
    () => ({ isOpen, onOpenChange: onOpenChange ?? (() => {}), variants, transition }),
    [isOpen, onOpenChange, variants, transition]
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
  const { isOpen, onOpenChange } = React.useContext(DisclosureContext);
  
  return (
    <button
      type="button"
      className={cn('w-full text-left', className)}
      onClick={() => onOpenChange(!isOpen)}
      aria-expanded={isOpen}
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
  const { isOpen } = React.useContext(DisclosureContext);
  
  return (
    <AnimatePresence>
      {isOpen && (
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