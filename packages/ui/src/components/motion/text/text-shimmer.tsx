'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface TextShimmerProps extends Omit<HTMLMotionProps<'span'>, 'animate' | 'transition'> {
  baseColor?: string;
  shimmerColor?: string;
  gradientSize?: number;
  gradientAngle?: number;
  delay?: number;
  duration?: number;
  ease?: string;
  repeat?: number;
}

export const TextShimmer = React.forwardRef<HTMLSpanElement, TextShimmerProps>(({
  children,
  className,
  style,
  baseColor = 'hsl(0 0% 20%)',
  shimmerColor = 'hsl(0 0% 90%)',
  gradientSize = 200,
  gradientAngle = -45,
  delay = 0,
  duration = 2,
  ease = 'linear',
  repeat = Infinity,
  ...props
}, ref) => {
  return (
    <motion.span
      ref={ref}
      className={cn('inline-block', className)}
      style={{
        background: `linear-gradient(${gradientAngle}deg, ${baseColor}, ${shimmerColor}, ${baseColor})`,
        backgroundSize: `${gradientSize}% 100%`,
        color: 'transparent',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        ...style
      }}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
      }}
      transition={{
        duration,
        ease,
        repeat,
        delay
      }}
      {...props}
    >
      {children}
    </motion.span>
  );
});

TextShimmer.displayName = 'TextShimmer'; 