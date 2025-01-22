'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface SpinningTextProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: string;
  className?: string;
  radius?: number;
  fontSize?: number;
  letterSpacing?: number;
  duration?: number;
  direction?: 'clockwise' | 'counterclockwise';
  spring?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
  onRotationComplete?: () => void;
}

const defaultSpring = {
  stiffness: 500,
  damping: 50,
  mass: 0.5
};

export const SpinningText = React.forwardRef<HTMLDivElement, SpinningTextProps>(({
  children,
  className,
  radius = 100,
  fontSize = 20,
  letterSpacing = 1,
  duration = 10,
  direction = 'clockwise',
  spring = defaultSpring,
  onRotationComplete,
  ...props
}, ref) => {
  const chars = React.useMemo(() => children.split(''), [children]);
  const numChars = chars.length;
  const angleStep = (2 * Math.PI) / numChars;

  return (
    <motion.div
      ref={ref}
      className={cn('relative', className)}
      style={{
        width: radius * 2,
        height: radius * 2
      }}
      {...props}
    >
      {chars.map((char, i) => {
        const angle = angleStep * i;
        const x = radius + radius * Math.cos(angle);
        const y = radius + radius * Math.sin(angle);

        return (
          <motion.span
            key={i}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: x,
              top: y,
              fontSize,
              letterSpacing,
              transformOrigin: `${radius}px ${radius}px`
            }}
            animate={{
              rotate: direction === 'clockwise' ? 360 : -360
            }}
            transition={{
              ...spring,
              repeat: Infinity,
              duration,
              ease: 'linear'
            }}
            onAnimationComplete={onRotationComplete}
          >
            {char}
          </motion.span>
        );
      })}
    </motion.div>
  );
});

SpinningText.displayName = 'SpinningText'; 