'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, useMotionValue, useSpring, HTMLMotionProps } from 'framer-motion';

export interface SpotlightProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode;
  className?: string;
  size?: number;
  color?: string;
  blur?: number;
  opacity?: number;
  spring?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
}

const defaultSpring = {
  stiffness: 500,
  damping: 50,
  mass: 0.5
};

export const Spotlight = React.forwardRef<HTMLDivElement, SpotlightProps>(({
  children,
  className,
  size = 400,
  color = 'white',
  blur = 40,
  opacity = 0.2,
  spring = defaultSpring,
  ...props
}, ref) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, spring);
  const smoothY = useSpring(mouseY, spring);

  const handleMouseMove = React.useCallback((_event: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget, clientX, clientY } = _event;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={ref}
      className={cn('relative overflow-hidden', className)}
      onMouseMove={handleMouseMove}
      {...props}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px"
        style={{
          background: `radial-gradient(${size}px circle at ${smoothX}px ${smoothY}px, ${color}, transparent ${blur}%)`,
          opacity
        }}
      />
      {children}
    </motion.div>
  );
});

Spotlight.displayName = 'Spotlight'; 