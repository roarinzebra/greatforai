'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, useMotionValue, useTransform, useSpring, useAnimationFrame } from 'framer-motion';

export interface InfiniteSliderProps {
  children: React.ReactNode[];
  className?: string;
  style?: React.CSSProperties;
  direction?: 'horizontal' | 'vertical';
  speed?: number;
  pauseOnHover?: boolean;
  reverse?: boolean;
  springConfig?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
  gap?: number;
  onItemClick?: (index: number) => void;
}

export const InfiniteSlider = React.forwardRef<HTMLDivElement, InfiniteSliderProps>(
  ({
    children,
    className,
    style,
    direction = 'horizontal',
    speed = 50,
    pauseOnHover = true,
    reverse = false,
    springConfig = {
      stiffness: 100,
      damping: 30,
      mass: 1,
    },
    gap = 16,
    onItemClick,
  }, ref) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [containerSize, setContainerSize] = React.useState(0);
    const [contentSize, setContentSize] = React.useState(0);
    const [isPaused, setIsPaused] = React.useState(false);

    const isHorizontal = direction === 'horizontal';
    const position = useMotionValue(0);
    const smoothPosition = useSpring(position, springConfig);

    const translateValue = useTransform(smoothPosition, (latest) => {
      return (latest % contentSize) * (reverse ? 1 : -1);
    });

    React.useEffect(() => {
      if (!containerRef.current) return;

      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target === containerRef.current) {
            const size = isHorizontal ? entry.contentRect.width : entry.contentRect.height;
            setContainerSize(size);
            setContentSize(size * 2 + gap);
          }
        }
      });

      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }, [gap, isHorizontal]);

    useAnimationFrame((_, delta) => {
      if (isPaused) return;
      
      const velocity = (speed * delta) / 16;
      position.set(position.get() + (direction === 'horizontal' ? -velocity : velocity));
    });

    const items = React.useMemo(() => {
      return [...children, ...children];
    }, [children]);

    return (
      <motion.div
        ref={ref}
        className={cn('relative overflow-hidden', className)}
        style={style}
        onHoverStart={() => pauseOnHover && setIsPaused(true)}
        onHoverEnd={() => pauseOnHover && setIsPaused(false)}
      >
        <motion.div
          ref={containerRef}
          className={cn('flex', {
            'flex-col': !isHorizontal,
          })}
          style={{
            ...(isHorizontal
              ? { x: translateValue, gap, paddingLeft: gap }
              : { y: translateValue, gap, paddingTop: gap }),
          }}
        >
          {items.map((child, index) => (
            <motion.div
              key={index}
              className="shrink-0"
              style={{
                ...(isHorizontal
                  ? { width: containerSize ? `${containerSize}px` : 'auto' }
                  : { height: containerSize ? `${containerSize}px` : 'auto' }),
              }}
              onClick={() => onItemClick?.(index % children.length)}
            >
              {child}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    );
  }
);

InfiniteSlider.displayName = 'InfiniteSlider'; 