'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, useMotionValue, useSpring, useAnimationFrame, PanInfo } from 'framer-motion';

export interface CarouselProps {
  children: React.ReactNode[];
  className?: string;
  style?: React.CSSProperties;
  gap?: number;
  speed?: number;
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  springConfig?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
  onItemClick?: (itemIndex: number) => void;
  dragElastic?: number;
  dragMomentum?: boolean;
  dragConstraints?: { left: number; right: number };
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDrag?: (dragInfo: PanInfo) => void;
}

export const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({
    children,
    className,
    style,
    gap = 20,
    speed = 1,
    direction = 'left',
    pauseOnHover = true,
    springConfig = {
      stiffness: 100,
      damping: 30,
      mass: 1,
    },
    onItemClick,
    dragElastic = 0.5,
    dragMomentum = true,
    dragConstraints,
    onDragStart,
    onDragEnd,
    onDrag,
  }, ref) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = React.useState(0);
    const [contentWidth, setContentWidth] = React.useState(0);
    const [isPaused, setIsPaused] = React.useState(false);
    const [isDragging, setIsDragging] = React.useState(false);
    const [currentIndex, setCurrentIndex] = React.useState(0);

    const motionX = useMotionValue(0);
    const springX = useSpring(motionX, springConfig);

    const handleDragStart = () => {
      setIsDragging(true);
      setIsPaused(true);
      onDragStart?.();
    };

    const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, dragInfo: PanInfo) => {
      setIsDragging(false);
      setIsPaused(false);
      
      const velocity = dragInfo.velocity.x;
      const offset = dragInfo.offset.x;
      
      if (Math.abs(velocity) > 500 || Math.abs(offset) > containerWidth / 2) {
        const direction = velocity < 0 || offset < 0 ? 1 : -1;
        const targetIndex = Math.min(
          Math.max(0, currentIndex + direction),
          children.length - 1
        );
        setCurrentIndex(targetIndex);
        motionX.set(-targetIndex * containerWidth);
      } else {
        motionX.set(-currentIndex * containerWidth);
      }
      
      onDragEnd?.();
    };

    React.useEffect(() => {
      if (!containerRef.current) return;
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target === containerRef.current) {
            setContainerWidth(entry.contentRect.width);
            setContentWidth(entry.contentRect.width * 2 + gap);
          }
        }
      });

      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }, [gap]);

    useAnimationFrame((_, delta) => {
      if (isPaused || isDragging) return;

      const newX = motionX.get() + speed * (direction === 'right' ? 1 : -1) * delta;
      motionX.set(newX % contentWidth);
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
        role="region"
        aria-label="Carousel"
        aria-roledescription="carousel"
      >
        <motion.div
          ref={containerRef}
          className="flex"
          style={{
            x: springX,
            gap,
            paddingLeft: gap,
          }}
          drag="x"
          dragElastic={dragElastic}
          dragMomentum={dragMomentum}
          dragConstraints={dragConstraints || { left: -contentWidth + containerWidth, right: 0 }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrag={(_, dragInfo) => onDrag?.(dragInfo)}
          whileTap={{ cursor: 'grabbing' }}
        >
          {items.map((child, idx) => (
            <motion.div
              key={idx}
              className="shrink-0"
              style={{
                width: containerWidth ? `${containerWidth}px` : 'auto',
              }}
              onClick={() => onItemClick?.(idx % children.length)}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${(idx % children.length) + 1} of ${children.length}`}
            >
              {child}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    );
  }
);

Carousel.displayName = 'Carousel'; 