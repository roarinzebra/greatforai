'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, useMotionValue, useSpring, HTMLMotionProps } from 'framer-motion';

export interface GlowEffectProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children?: React.ReactNode;
  color?: string;
  size?: number;
  blur?: number;
  opacity?: number;
}

const defaultSpring = {
  stiffness: 400,
  damping: 30,
  mass: 1,
};

export const GlowEffect = React.forwardRef<HTMLDivElement, GlowEffectProps>(
  ({
    className,
    children,
    color = 'rgb(var(--primary))',
    size = 400,
    blur = 100,
    opacity = 0.5,
    ...props
  }, ref) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const smoothX = useSpring(mouseX, defaultSpring);
    const smoothY = useSpring(mouseY, defaultSpring);

    const handleMouseMove = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      mouseX.set(event.clientX - rect.left);
      mouseY.set(event.clientY - rect.top);
    }, [mouseX, mouseY]);

    const handleMouseEnter = React.useCallback(() => {
      // Intentionally empty as we don't need to handle mouse enter
    }, []);

    const handleMouseLeave = React.useCallback(() => {
      mouseX.set(0);
      mouseY.set(0);
    }, [mouseX, mouseY]);

    return (
      <motion.div
        ref={ref}
        className={cn('relative overflow-hidden', className)}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <motion.div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(${size}px circle at ${smoothX}px ${smoothY}px, ${color}, transparent)`,
            filter: `blur(${blur}px)`,
            opacity,
          }}
        />
        {children}
      </motion.div>
    );
  }
);

GlowEffect.displayName = 'GlowEffect'; 