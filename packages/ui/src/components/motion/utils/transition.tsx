'use client';

import * as React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface TransitionProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  initial?: {
    opacity?: number;
    y?: number;
    x?: number;
    scale?: number;
  };
  animate?: {
    opacity?: number;
    y?: number;
    x?: number;
    scale?: number;
  };
  exit?: {
    opacity?: number;
    y?: number;
    x?: number;
    scale?: number;
  };
}

export const Transition = React.forwardRef<HTMLDivElement, TransitionProps>(
  (
    {
      children,
      className,
      initial = { opacity: 0, y: 20 },
      animate = { opacity: 1, y: 0 },
      exit = { opacity: 0, y: -20 },
      transition = {
        type: 'spring',
        stiffness: 150,
        damping: 30,
      },
      ...props
    },
    ref
  ): React.JSX.Element => {
    return (
      <motion.div
        ref={ref}
        className={className}
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