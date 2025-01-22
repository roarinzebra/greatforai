'use client';

import * as React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TransitionProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  initial?: Record<string, any>;
  animate?: Record<string, any>;
  exit?: Record<string, any>;
  transition?: {
    type?: 'tween' | 'spring';
    duration?: number;
    stiffness?: number;
    damping?: number;
    mass?: number;
    bounce?: number;
  };
}

const defaultTransition = {
  type: 'tween' as const,
  duration: 0.2,
  stiffness: 100,
  damping: 10,
  mass: 1,
  bounce: 0,
};

export const Transition = React.forwardRef<HTMLDivElement, TransitionProps>(
  ({ 
    children, 
    className,
    initial = { opacity: 0 },
    animate = { opacity: 1 },
    exit = { opacity: 0 },
    transition = defaultTransition,
    ...props 
  }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn('relative', className)}
        initial={initial}
        animate={animate}
        exit={exit}
        transition={transition}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Transition.displayName = 'Transition'; 