'use client';

import * as React from 'react';
import { motion, useScroll, useSpring, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ScrollProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  offset?: ['start start' | 'start end' | 'end start' | 'end end'];
  target?: React.RefObject<HTMLElement>;
  spring?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
}

const defaultSpring = {
  stiffness: 100,
  damping: 30,
  mass: 1,
};

export const Scroll = React.forwardRef<HTMLDivElement, ScrollProps>(
  ({ children, className, offset = ['start end'], target, spring = defaultSpring, ...props }, ref) => {
    const { scrollYProgress } = useScroll({
      target,
      offset,
    });

    const smoothProgress = useSpring(scrollYProgress, spring);

    return (
      <motion.div
        ref={ref}
        className={cn('relative', className)}
        style={{ opacity: smoothProgress }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Scroll.displayName = 'Scroll'; 