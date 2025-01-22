'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  AnimatePresence,
  motion,
  Transition,
  Variants,
  AnimatePresenceProps,
} from 'framer-motion';

export interface TextLoopProps {
  children: React.ReactNode[];
  className?: string;
  interval?: number;
  transition?: Transition;
  variants?: Variants;
  onIndexChange?: (index: number) => void;
  trigger?: boolean;
  mode?: AnimatePresenceProps['mode'];
}

const defaultVariants: Variants = {
  enter: { opacity: 0, y: 20 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const TextLoop = React.forwardRef<HTMLDivElement, TextLoopProps>(
  ({
    children,
    className,
    interval = 2000,
    transition,
    variants = defaultVariants,
    onIndexChange,
    trigger = true,
    mode = 'popLayout',
  }, ref) => {
    const [index, setIndex] = React.useState(0);
    const [direction, setDirection] = React.useState(1);

    React.useEffect(() => {
      if (!trigger) return;

      const timer = setInterval(() => {
        if (onIndexChange) {
          // If onIndexChange is provided, alternate direction
          setDirection(prev => prev * -1);
          setIndex(current => {
            const next = current + direction;
            if (next >= children.length) return 0;
            if (next < 0) return children.length - 1;
            return next;
          });
        } else {
          // Simple forward loop
          setIndex(current => (current + 1) % children.length);
        }
      }, interval);

      return () => clearInterval(timer);
    }, [children.length, interval, trigger, direction, onIndexChange]);

    React.useEffect(() => {
      onIndexChange?.(index);
    }, [index, onIndexChange]);

    return (
      <div ref={ref} className={cn('relative', className)}>
        <AnimatePresence mode={mode} initial={false}>
          <motion.div
            key={index}
            initial="enter"
            animate="center"
            exit="exit"
            variants={variants}
            transition={transition || {
              duration: Math.min(0.3, interval / 1000 / 3), // Ensure transition is not longer than 1/3 of interval
              ease: 'easeInOut',
            }}
            className="absolute inset-0"
          >
            {children[index]}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }
);

TextLoop.displayName = 'TextLoop'; 