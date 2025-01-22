'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, useMotionValue, useSpring, useTransform, HTMLMotionProps } from 'framer-motion';

export interface TiltProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
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
}

const defaultSpring = {
  stiffness: 500,
  damping: 50,
  mass: 0.5
};

export const Tilt = React.forwardRef<HTMLDivElement, TiltProps>(({
  children,
  className,
  tiltAmount = 20,
  perspective = 1000,
  scale = 1.05,
  spring = defaultSpring,
  ...props
}, ref) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, spring);
  const smoothY = useSpring(mouseY, spring);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [tiltAmount, -tiltAmount]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-tiltAmount, tiltAmount]);

  const handleMouseMove = React.useCallback((_event: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget, clientX, clientY } = _event;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  const handleMouseLeave = React.useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={ref}
      className={cn('relative', className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective,
        transformStyle: 'preserve-3d'
      }}
      whileHover={{ scale }}
      {...props}
    >
      <motion.div
        style={{
          rotateX,
          rotateY
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
});

Tilt.displayName = 'Tilt'; 