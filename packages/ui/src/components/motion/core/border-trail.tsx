'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

export interface BorderTrailProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  size?: number;
  color?: string;
  blur?: number;
  springConfig?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
  onAnimationComplete?: () => void;
  borderWidth?: number;
  borderRadius?: number;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  trailLength?: number;
  trailOpacity?: number;
  trailBlendMode?: React.CSSProperties['mixBlendMode'];
  disabled?: boolean;
}

export const BorderTrail = React.forwardRef<HTMLDivElement, BorderTrailProps>(
  ({
    children,
    className,
    style,
    size = 60,
    color = 'hsl(0 0% 100% / 0.2)',
    blur = 10,
    springConfig = {
      stiffness: 150,
      damping: 15,
      mass: 1,
    },
    onAnimationComplete,
    borderWidth = 1,
    borderRadius = 8,
    borderStyle = 'solid',
    trailLength = 0.5,
    trailOpacity = 0.5,
    trailBlendMode = 'normal',
    disabled = false,
  }, ref) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const rect = React.useRef<DOMRect | null>(null);
    const isHovering = React.useRef(false);

    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    const borderX = useTransform(springX, (latest) => {
      if (!rect.current) return '0%';
      return `${(latest / rect.current.width) * 100}%`;
    });

    const borderY = useTransform(springY, (latest) => {
      if (!rect.current) return '0%';
      return `${(latest / rect.current.height) * 100}%`;
    });

    const handleMouseMove = React.useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (disabled || !isHovering.current) return;
        rect.current = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.current.left;
        const y = e.clientY - rect.current.top;
        mouseX.set(x);
        mouseY.set(y);
      },
      [disabled, mouseX, mouseY]
    );

    const handleMouseEnter = React.useCallback(() => {
      isHovering.current = true;
    }, []);

    const handleMouseLeave = React.useCallback(() => {
      isHovering.current = false;
    }, []);

    return (
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn('relative overflow-hidden', className)}
        style={{
          ...style,
          borderRadius,
        }}
        onAnimationComplete={onAnimationComplete}
      >
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              linear-gradient(90deg, 
                transparent ${borderX}, 
                ${color} ${borderX}, 
                ${color} calc(${borderX} + ${trailLength * 100}%), 
                transparent calc(${borderX} + ${trailLength * 100}%)
              ),
              linear-gradient(180deg, 
                transparent ${borderY}, 
                ${color} ${borderY}, 
                ${color} calc(${borderY} + ${trailLength * 100}%), 
                transparent calc(${borderY} + ${trailLength * 100}%)
              )
            `,
            backgroundSize: `${size}px ${borderWidth}px, ${borderWidth}px ${size}px`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'left top, left top',
            filter: `blur(${blur}px)`,
            opacity: trailOpacity,
            mixBlendMode: trailBlendMode,
            borderStyle,
          }}
        />
        {children}
      </motion.div>
    );
  }
);

BorderTrail.displayName = 'BorderTrail'; 