'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export interface SpotlightProps {
  children: React.ReactNode;
  className?: string;
  size?: number;
  spring?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
    bounce?: number;
  };
  onMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const defaultSpring = {
  stiffness: 400,
  damping: 30,
  mass: 1,
  bounce: 0,
};

export const Spotlight = React.forwardRef<HTMLDivElement, SpotlightProps>(
  ({ 
    children,
    className,
    size = 200,
    spring = defaultSpring,
    onMouseMove,
    onMouseLeave,
  }, ref) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const spotlightX = useSpring(mouseX, spring);
    const spotlightY = useSpring(mouseY, spring);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseX.set(x);
      mouseY.set(y);
      onMouseMove?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      mouseX.set(0);
      mouseY.set(0);
      onMouseLeave?.(e);
    };

    return (
      <motion.div
        ref={ref}
        className={cn('relative overflow-hidden', className)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className="pointer-events-none absolute -inset-px"
          style={{
            background: `radial-gradient(${size}px circle at ${spotlightX}px ${spotlightY}px, rgba(255,255,255,0.15), transparent 80%)`,
          }}
        />
        {children}
      </motion.div>
    );
  }
);

Spotlight.displayName = 'Spotlight'; 