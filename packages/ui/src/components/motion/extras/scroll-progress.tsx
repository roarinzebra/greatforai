'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, useScroll, useSpring, useTransform, HTMLMotionProps } from 'framer-motion';

export interface ScrollProgressProps extends Omit<HTMLMotionProps<'div'>, 'style'> {
  className?: string;
  origin?: 'left' | 'right' | 'top' | 'bottom';
  orientation?: 'horizontal' | 'vertical';
  offset?: ['start start' | 'start end' | 'end start' | 'end end'];
  target?: React.RefObject<HTMLElement>;
  spring?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
}

const defaultSpring = {
  stiffness: 500,
  damping: 50,
  mass: 0.5
};

export const ScrollProgress = React.forwardRef<HTMLDivElement, ScrollProgressProps>(({
  className,
  origin = 'left',
  orientation = 'horizontal',
  offset = ['start end'],
  target,
  spring = defaultSpring,
  ...props
}, ref) => {
  const { scrollYProgress } = useScroll({
    target,
    offset
  });

  const smoothProgress = useSpring(scrollYProgress, spring);
  const scaleX = useTransform(smoothProgress, [0, 1], [0, 1]);
  const scaleY = useTransform(smoothProgress, [0, 1], [0, 1]);

  const transformOrigin = React.useMemo(() => {
    switch (origin) {
      case 'right':
        return 'right';
      case 'top':
        return 'top';
      case 'bottom':
        return 'bottom';
      default:
        return 'left';
    }
  }, [origin]);

  return (
    <motion.div
      ref={ref}
      className={cn(
        'fixed inset-0 pointer-events-none',
        orientation === 'horizontal' ? 'h-1' : 'w-1',
        className
      )}
      style={{
        transformOrigin,
        scaleX: orientation === 'horizontal' ? scaleX : 1,
        scaleY: orientation === 'vertical' ? scaleY : 1
      }}
      {...props}
    />
  );
});

ScrollProgress.displayName = 'ScrollProgress'; 