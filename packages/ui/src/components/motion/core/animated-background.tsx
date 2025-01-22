'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, useMotionTemplate, useMotionValue, useSpring, HTMLMotionProps } from 'framer-motion';

interface AnimatedBackgroundProps extends Omit<HTMLMotionProps<'div'>, 'style'> {
  size?: number;
  color?: string;
  blur?: number;
  springConfig?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
  style?: React.CSSProperties;
}

export const AnimatedBackground = React.forwardRef<HTMLDivElement, AnimatedBackgroundProps>(({
  className,
  style,
  size = 400,
  color = 'hsl(0 0% 100% / 0.15)',
  blur = 200,
  springConfig = {
    stiffness: 400,
    damping: 30,
    mass: 1,
  },
  ...props
}, ref) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const background = useMotionTemplate`radial-gradient(${size}px circle at ${springX}px ${springY}px, ${color}, transparent 80%)`;

  const handleMouseMove = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={ref}
      className={cn('relative overflow-hidden', className)}
      style={{
        ...style,
        background,
        filter: `blur(${blur}px)`,
      }}
      onMouseMove={handleMouseMove}
      {...props}
    />
  );
});

AnimatedBackground.displayName = 'AnimatedBackground'; 