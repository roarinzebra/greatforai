'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  AnimatePresence,
  motion,
  Variants,
  AnimatePresenceProps,
  TargetAndTransition,
} from 'framer-motion';

export interface TextLoopProps {
  children: string[];
  className?: string;
  interval?: number;
  transition?: {
    type?: 'spring' | 'tween';
    duration?: number;
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
  variants?: {
    enter?: TargetAndTransition;
    exit?: TargetAndTransition;
  };
  // eslint-disable-next-line no-unused-vars
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
    interval = 3000,
    transition,
    variants = defaultVariants,
    onIndexChange,
    trigger = true,
    mode = 'popLayout',
  }, ref) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);

    React.useEffect(() => {
      if (!trigger) return;

      const timer = setInterval(() => {
        setCurrentIndex(current => {
          const next = (current + 1) % children.length;
          onIndexChange?.(next);
          return next;
        });
      }, interval);

      return () => clearInterval(timer);
    }, [children.length, interval, trigger, onIndexChange]);

    return (
      <div ref={ref} className={cn('relative', className)}>
        <AnimatePresence mode={mode} initial={false}>
          <motion.div
            key={currentIndex}
            initial="enter"
            animate="center"
            exit="exit"
            variants={variants}
            transition={transition || {
              duration: Math.min(0.3, interval / 1000 / 3),
              ease: 'easeInOut',
            }}
            className="absolute inset-0"
          >
            {children[currentIndex]}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }
);

TextLoop.displayName = 'TextLoop'; 