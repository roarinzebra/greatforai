'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export interface TiltProps {
  children: React.ReactNode;
  className?: string;
  tiltAmount?: number;
  perspective?: number;
  scale?: number;
  spring?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
  onMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const defaultSpring = {
  stiffness: 400,
  damping: 30,
  mass: 1,
};

export const Tilt = React.forwardRef<HTMLDivElement, TiltProps>(
  ({ 
    children,
    className,
    tiltAmount = 20,
    perspective = 1000,
    scale = 1.05,
    spring = defaultSpring,
    onMouseMove,
    onMouseLeave,
  }, ref) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [tiltAmount, -tiltAmount]), spring);
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-tiltAmount, tiltAmount]), spring);
    const scaleValue = useSpring(1, spring);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const x = (e.clientX - rect.left) / width - 0.5;
      const y = (e.clientY - rect.top) / height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
      scaleValue.set(scale);
      onMouseMove?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      mouseX.set(0);
      mouseY.set(0);
      scaleValue.set(1);
      onMouseLeave?.(e);
    };

    return (
      <motion.div
        ref={ref}
        className={cn('relative transform-gpu', className)}
        style={{
          perspective,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          style={{
            rotateX,
            rotateY,
            scale: scaleValue,
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    );
  }
);

Tilt.displayName = 'Tilt'; 