'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  radius?: number;
  spring?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
  onMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const defaultSpring = {
  stiffness: 150,
  damping: 15,
  mass: 1,
};

export const Magnetic = React.forwardRef<HTMLDivElement, MagneticProps>(
  ({ 
    children,
    className,
    strength = 50,
    radius = 800,
    spring = defaultSpring,
    onMouseMove,
    onMouseEnter,
    onMouseLeave,
  }, ref) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const smoothX = useSpring(mouseX, spring);
    const smoothY = useSpring(mouseY, spring);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));

      if (distance < radius) {
        const scaleFactor = strength / 100;
        const distanceRatio = Math.min(distance / radius, 1);
        const moveX = distanceX * scaleFactor * (1 - distanceRatio);
        const moveY = distanceY * scaleFactor * (1 - distanceRatio);
        mouseX.set(moveX);
        mouseY.set(moveY);
      } else {
        mouseX.set(0);
        mouseY.set(0);
      }

      onMouseMove?.(e);
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      mouseX.set(0);
      mouseY.set(0);
      onMouseLeave?.(e);
    };

    return (
      <motion.div
        ref={ref}
        className={cn('inline-block', className)}
        style={{
          x: smoothX,
          y: smoothY,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </motion.div>
    );
  }
);

Magnetic.displayName = 'Magnetic'; 