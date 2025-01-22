'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface SpinningTextProps {
  children: string;
  className?: string;
  radius?: number;
  fontSize?: number | string;
  letterSpacing?: number | string;
  duration?: number;
  direction?: 'clockwise' | 'counterclockwise';
  spring?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
  onRotationComplete?: () => void;
}

const defaultSpring: Required<SpinningTextProps['spring']> = {
  stiffness: 150,
  damping: 15,
  mass: 1,
};

export const SpinningText = React.forwardRef<HTMLDivElement, SpinningTextProps>(
  ({ 
    children,
    className,
    radius = 100,
    fontSize = '1em',
    letterSpacing = '0.2em',
    duration = 10,
    direction = 'clockwise',
    spring = defaultSpring,
    onRotationComplete,
  }, ref) => {
    const characters = children.split('');
    const numChars = characters.length;
    const angleStep = (2 * Math.PI) / numChars;

    return (
      <motion.div
        ref={ref}
        className={cn('relative', className)}
        style={{
          width: radius * 2,
          height: radius * 2,
        }}
      >
        {characters.map((char, i) => {
          const angle = i * angleStep;
          const x = radius + Math.cos(angle) * radius;
          const y = radius + Math.sin(angle) * radius;
          const rotate = (angle * 180) / Math.PI;

          return (
            <motion.span
              key={i}
              className="absolute transform-gpu"
              style={{
                left: x,
                top: y,
                fontSize,
                letterSpacing,
                transform: `translate(-50%, -50%) rotate(${rotate + 90}deg)`,
                transformOrigin: 'center',
              }}
              animate={{
                rotate: [
                  rotate + 90,
                  rotate + (direction === 'clockwise' ? 450 : -270),
                ],
              }}
              transition={{
                duration,
                repeat: Infinity,
                ease: 'linear',
                ...spring,
              }}
              onAnimationComplete={onRotationComplete}
            >
              {char}
            </motion.span>
          );
        })}
      </motion.div>
    );
  }
);

SpinningText.displayName = 'SpinningText'; 