'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, useMotionValue, useSpring, HTMLMotionProps } from 'framer-motion';

export interface ImageComparisonProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  before: string;
  after: string;
  width?: number;
  height?: number;
  alt?: string;
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

export const ImageComparison = React.forwardRef<HTMLDivElement, ImageComparisonProps>(
  ({
    className,
    before,
    after,
    width = 500,
    height = 300,
    alt = 'Image comparison',
    spring = defaultSpring,
    ...props
  }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const mouseX = useMotionValue(0);
    const smoothX = useSpring(mouseX, spring);

    const handleMouseMove = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = (x / rect.width) * 100;
      mouseX.set(Math.min(Math.max(pct, 0), 100));
    }, [mouseX]);

    const handleMouseEnter = React.useCallback(() => {
      setIsHovered(true);
    }, []);

    const handleMouseLeave = React.useCallback(() => {
      setIsHovered(false);
      mouseX.set(50);
    }, [mouseX]);

    React.useEffect(() => {
      mouseX.set(50);
    }, [mouseX]);

    return (
      <motion.div
        ref={ref}
        className={cn('relative overflow-hidden', className)}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ width, height }}
        {...props}
      >
        <div className="absolute inset-0">
          <img
            src={before}
            alt={`${alt} - Before`}
            className="h-full w-full object-cover"
          />
        </div>
        <motion.div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - smoothX.get()}% 0 0)` }}
        >
          <img
            src={after}
            alt={`${alt} - After`}
            className="h-full w-full object-cover"
          />
        </motion.div>
        <motion.div
          className="absolute inset-y-0"
          style={{ left: `${smoothX.get()}%` }}
        >
          <div className="relative h-full">
            <div className="absolute inset-y-0 -left-px w-0.5 bg-white" />
            <div
              className={cn(
                'absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-2 transition-transform',
                isHovered ? 'scale-110' : 'scale-100'
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-black"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }
);

ImageComparison.displayName = 'ImageComparison'; 