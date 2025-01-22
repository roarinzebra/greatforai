'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export interface GlowEffectProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  size?: number;
  blur?: number;
  opacity?: number;
  offset?: {
    x?: number;
    y?: number;
  };
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

export const GlowEffect = React.forwardRef<HTMLDivElement, GlowEffectProps>(
  ({ 
    children,
    className,
    color = 'hsl(0 0% 100% / 0.5)',
    size = 300,
    blur = 30,
    opacity = 0.15,
    offset = { x: 0, y: 0 },
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
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
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
        className={cn('relative overflow-hidden', className)}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className="pointer-events-none absolute -inset-px"
          style={{
            background: `radial-gradient(${size}px circle at ${smoothX}px ${smoothY}px, ${color}, transparent)`,
            opacity,
            filter: `blur(${blur}px)`,
            transform: `translate(${offset.x}px, ${offset.y}px)`,
          }}
        />
        {children}
      </motion.div>
    );
  }
);

GlowEffect.displayName = 'GlowEffect'; 