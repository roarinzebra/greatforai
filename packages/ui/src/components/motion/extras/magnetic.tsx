'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, useMotionValue, useSpring, HTMLMotionProps } from 'framer-motion';

export interface MagneticProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children?: React.ReactNode;
  strength?: number;
  radius?: number;
  spring?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
}

const defaultSpring = {
  stiffness: 400,
  damping: 30,
  mass: 1,
};

export const Magnetic = React.forwardRef<HTMLDivElement, MagneticProps>(
  ({
    className,
    children,
    strength = 30,
    radius = 400,
    spring = defaultSpring,
    onMouseMove,
    onMouseLeave,
    ...props
  }, ref) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const smoothX = useSpring(mouseX, spring);
    const smoothY = useSpring(mouseY, spring);

    const handleMouseMove = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
      );

      if (distance < radius) {
        const scaledStrength = (1 - distance / radius) * strength;
        mouseX.set((e.clientX - centerX) * scaledStrength);
        mouseY.set((e.clientY - centerY) * scaledStrength);
      } else {
        mouseX.set(0);
        mouseY.set(0);
      }

      onMouseMove?.(e);
    }, [mouseX, mouseY, radius, strength, onMouseMove]);

    const handleMouseLeave = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      mouseX.set(0);
      mouseY.set(0);
      onMouseLeave?.(e);
    }, [mouseX, mouseY, onMouseLeave]);

    return (
      <motion.div
        ref={ref}
        className={cn('inline-block', className)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: 'translate(var(--x), var(--y))',
          '--x': smoothX.get() + 'px',
          '--y': smoothY.get() + 'px',
        } as React.CSSProperties}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Magnetic.displayName = 'Magnetic'; 