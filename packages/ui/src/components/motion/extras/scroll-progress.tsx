'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

export interface ScrollProgressProps {
  children?: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  spring?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
  origin?: 'left' | 'right' | 'top' | 'bottom';
  orientation?: 'horizontal' | 'vertical';
  offset?: ['start start' | 'start end' | 'end start' | 'end end'];
  target?: React.RefObject<HTMLElement>;
  onProgressChange?: (progress: number) => void;
  style?: React.CSSProperties;
}

const defaultSpring: Required<ScrollProgressProps['spring']> = {
  stiffness: 100,
  damping: 30,
  mass: 1,
};

export const ScrollProgress = React.forwardRef<HTMLDivElement, ScrollProgressProps>(
  ({ 
    children,
    className,
    as: Component = motion.div,
    spring = defaultSpring,
    origin = 'left',
    orientation = 'horizontal',
    offset = ['start end'],
    target,
    onProgressChange,
    style,
  }, ref) => {
    const { scrollYProgress } = useScroll({
      target,
      offset,
    });

    const smoothProgress = useSpring(scrollYProgress, spring);

    const scaleX = useTransform(smoothProgress, [0, 1], [0, 1]);
    const scaleY = useTransform(smoothProgress, [0, 1], [0, 1]);

    React.useEffect(() => {
      if (!onProgressChange) return;
      return smoothProgress.on('change', onProgressChange);
    }, [smoothProgress, onProgressChange]);

    const getTransformOrigin = () => {
      switch (origin) {
        case 'left':
          return 'left center';
        case 'right':
          return 'right center';
        case 'top':
          return 'center top';
        case 'bottom':
          return 'center bottom';
        default:
          return 'left center';
      }
    };

    return (
      <Component
        ref={ref}
        className={cn('fixed inset-x-0 top-0 h-1 bg-black/10', className)}
        style={{
          ...(orientation === 'horizontal'
            ? { scaleX, transformOrigin: getTransformOrigin() }
            : { scaleY, transformOrigin: getTransformOrigin() }),
          ...style,
        }}
      >
        {children}
      </Component>
    );
  }
);

ScrollProgress.displayName = 'ScrollProgress'; 