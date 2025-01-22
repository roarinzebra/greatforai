'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface TextShimmerWaveProps extends Omit<HTMLMotionProps<'span'>, 'animate' | 'transition'> {
  baseColor?: string;
  shimmerColor?: string;
  waveLength?: number;
  waveCount?: number;
  waveHeight?: number;
  perspective?: number;
  rotateX?: number;
  rotateY?: number;
  skewX?: number;
  skewY?: number;
  delay?: number;
  duration?: number;
  ease?: string;
  repeat?: number;
}

export const TextShimmerWave = React.forwardRef<HTMLSpanElement, TextShimmerWaveProps>(({
  children,
  className,
  style,
  baseColor = 'hsl(0 0% 20%)',
  shimmerColor = 'hsl(0 0% 90%)',
  waveLength = 100,
  waveCount = 3,
  waveHeight = 20,
  perspective = 500,
  rotateX = 45,
  rotateY = 0,
  skewX = 0,
  skewY = 0,
  delay = 0,
  duration = 2,
  ease = 'linear',
  repeat = Infinity,
  ...props
}, ref) => {
  const transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) skewX(${skewX}deg) skewY(${skewY}deg)`;
  const gradient = `repeating-linear-gradient(${90}deg, ${baseColor}, ${shimmerColor}, ${baseColor} ${waveLength}%)`;

  return (
    <motion.span
      ref={ref}
      className={cn('inline-block', className)}
      style={{
        background: gradient,
        backgroundSize: `${waveLength * waveCount}% 100%`,
        color: 'transparent',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        transform,
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

TextShimmerWave.displayName = 'TextShimmerWave'; 