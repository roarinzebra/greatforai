'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export interface ImageComparisonProps {
  beforeImage: string;
  afterImage: string;
  className?: string;
  direction?: 'horizontal' | 'vertical';
  spring?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
  initialPosition?: number;
  labels?: {
    before?: string;
    after?: string;
  };
  onPositionChange?: (position: number) => void;
}

const defaultSpring = {
  stiffness: 150,
  damping: 15,
  mass: 1,
};

export const ImageComparison = React.forwardRef<HTMLDivElement, ImageComparisonProps>(
  ({ 
    beforeImage,
    afterImage,
    className,
    direction = 'horizontal',
    spring = defaultSpring,
    initialPosition = 50,
    labels = {
      before: 'Before',
      after: 'After',
    },
    onPositionChange,
  }, ref) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const position = useMotionValue(initialPosition);
    const smoothPosition = useSpring(position, spring);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const value = direction === 'horizontal'
        ? ((e.clientX - rect.left) / rect.width) * 100
        : ((e.clientY - rect.top) / rect.height) * 100;

      const clampedValue = Math.max(0, Math.min(100, value));
      position.set(clampedValue);
      onPositionChange?.(clampedValue);
    };

    return (
      <motion.div
        ref={ref}
        className={cn('relative aspect-video overflow-hidden', className)}
      >
        <div
          ref={containerRef}
          className="relative h-full w-full cursor-ew-resize"
          onMouseMove={handleMouseMove}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${beforeImage})` }}
          >
            {labels.before && (
              <div className="absolute left-4 top-4 rounded-lg bg-black/50 px-3 py-1 text-sm text-white">
                {labels.before}
              </div>
            )}
          </div>
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${afterImage})`,
              clipPath: direction === 'horizontal'
                ? `inset(0 ${100 - smoothPosition.get()}% 0 0)`
                : `inset(0 0 ${100 - smoothPosition.get()}% 0)`,
            }}
          >
            {labels.after && (
              <div className="absolute right-4 top-4 rounded-lg bg-black/50 px-3 py-1 text-sm text-white">
                {labels.after}
              </div>
            )}
          </motion.div>
          <motion.div
            className={cn(
              'absolute bg-white',
              direction === 'horizontal'
                ? 'top-0 bottom-0 w-1 cursor-ew-resize'
                : 'left-0 right-0 h-1 cursor-ns-resize'
            )}
            style={{
              ...(direction === 'horizontal'
                ? { left: smoothPosition }
                : { top: smoothPosition }),
            }}
          />
        </div>
      </motion.div>
    );
  }
);

ImageComparison.displayName = 'ImageComparison'; 