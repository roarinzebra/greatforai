'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, Transition, TargetAndTransition } from 'framer-motion';

export interface TransitionPanelProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  variants?: {
    enter: TargetAndTransition;
    center: TargetAndTransition;
    exit: TargetAndTransition;
  };
  transition?: Transition;
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  ease?: string;
}

const defaultVariants = (direction: TransitionPanelProps['direction'] = 'right') => {
  const axis = direction === 'left' || direction === 'right' ? 'x' : 'y';
  const sign = direction === 'left' || direction === 'up' ? 1 : -1;

  return {
    enter: {
      [axis]: `${sign * 100}%`,
      opacity: 0,
    },
    center: {
      [axis]: 0,
      opacity: 1,
    },
    exit: {
      [axis]: `${sign * -100}%`,
      opacity: 0,
    },
  };
};

export const TransitionPanel = React.forwardRef<HTMLDivElement, TransitionPanelProps>(
  ({
    children,
    className,
    style,
    isOpen = false,
    onOpenChange,
    variants,
    transition,
    direction = 'right',
    duration = 0.3,
    ease = 'easeInOut',
  }, ref) => {
    const defaultTransition = {
      type: 'tween',
      duration,
      ease,
    };

    const handleClose = React.useCallback(() => {
      onOpenChange?.(false);
    }, [onOpenChange]);

    React.useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen && onOpenChange) {
          onOpenChange(false);
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onOpenChange]);

    return (
      <AnimatePresence initial={false} mode="wait">
        {isOpen && (
          <div
            ref={ref}
            className={cn('fixed inset-0 z-50', className)}
            style={style}
          >
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={defaultTransition}
              onClick={handleClose}
            />
            <div className="fixed inset-0 overflow-hidden">
              <div className="flex min-h-full items-center justify-center p-4">
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  className={cn(
                    'relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl',
                    className
                  )}
                  style={style}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  variants={variants ?? defaultVariants(direction)}
                  transition={transition ?? defaultTransition}
                >
                  {children}
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    );
  }
);

TransitionPanel.displayName = 'TransitionPanel'; 