'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export interface CursorProps {
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
  stickyElements?: string;
  magneticElements?: string;
  magneticForce?: number;
  mixBlendMode?: React.CSSProperties['mixBlendMode'];
  opacity?: number;
  zIndex?: number;
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  borderRadius?: string | number;
  backgroundColor?: string;
  transitionDuration?: number;
  transitionTimingFunction?: string;
  disabled?: boolean;
  hideOnLeave?: boolean;
}

export const Cursor = React.forwardRef<HTMLDivElement, CursorProps>(
  ({
    className,
    style,
    size = 40,
    color = 'hsl(0 0% 100% / 0.25)',
    blur = 10,
    springConfig = {
      stiffness: 400,
      damping: 30,
      mass: 1,
    },
    stickyElements = '[data-cursor-sticky]',
    magneticElements = '[data-cursor-magnetic]',
    magneticForce = 1,
    mixBlendMode = 'difference',
    opacity = 1,
    zIndex = 9999,
    borderWidth = 0,
    borderColor = 'currentColor',
    borderStyle = 'solid',
    borderRadius = '50%',
    backgroundColor = color,
    transitionDuration = 0.15,
    transitionTimingFunction = 'ease',
    disabled = false,
    hideOnLeave = true,
  }, ref) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [isVisible, setIsVisible] = React.useState(false);
    const [isSticky, setIsSticky] = React.useState(false);
    const [isMagnetic, setIsMagnetic] = React.useState(false);
    const stickyRef = React.useRef<Element | null>(null);
    const magneticRef = React.useRef<Element | null>(null);
    const cursorRef = React.useRef<HTMLDivElement | null>(null);

    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    React.useEffect(() => {
      if (disabled) return;

      const handleMouseMove = (e: MouseEvent) => {
        if (isSticky && stickyRef.current) {
          const rect = stickyRef.current.getBoundingClientRect();
          mouseX.set(rect.left + rect.width / 2);
          mouseY.set(rect.top + rect.height / 2);
        } else if (isMagnetic && magneticRef.current) {
          const rect = magneticRef.current.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const distance = Math.sqrt(
            Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
          );
          const maxDistance = Math.max(rect.width, rect.height) * magneticForce;
          if (distance < maxDistance) {
            const force = 1 - distance / maxDistance;
            mouseX.set(e.clientX + (centerX - e.clientX) * force);
            mouseY.set(e.clientY + (centerY - e.clientY) * force);
          } else {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
          }
        } else {
          mouseX.set(e.clientX);
          mouseY.set(e.clientY);
        }
      };

      const handleMouseEnter = () => hideOnLeave && setIsVisible(true);
      const handleMouseLeave = () => hideOnLeave && setIsVisible(false);

      const handleStickyEnter = (e: MouseEvent) => {
        const target = e.target as Element;
        if (target.matches(stickyElements)) {
          setIsSticky(true);
          stickyRef.current = target;
          if (cursorRef.current) {
            cursorRef.current.style.width = `${target.clientWidth}px`;
            cursorRef.current.style.height = `${target.clientHeight}px`;
            cursorRef.current.style.borderRadius = '0';
          }
        }
      };

      const handleStickyLeave = () => {
        setIsSticky(false);
        stickyRef.current = null;
        if (cursorRef.current) {
          cursorRef.current.style.width = `${size}px`;
          cursorRef.current.style.height = `${size}px`;
          cursorRef.current.style.borderRadius = typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius;
        }
      };

      const handleMagneticEnter = (e: MouseEvent) => {
        const target = e.target as Element;
        if (target.matches(magneticElements)) {
          setIsMagnetic(true);
          magneticRef.current = target;
        }
      };

      const handleMagneticLeave = () => {
        setIsMagnetic(false);
        magneticRef.current = null;
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseenter', handleMouseEnter);
      document.addEventListener('mouseleave', handleMouseLeave);
      document.addEventListener('mouseenter', handleStickyEnter, true);
      document.addEventListener('mouseleave', handleStickyLeave, true);
      document.addEventListener('mouseenter', handleMagneticEnter, true);
      document.addEventListener('mouseleave', handleMagneticLeave, true);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseenter', handleMouseEnter);
        document.removeEventListener('mouseleave', handleMouseLeave);
        document.removeEventListener('mouseenter', handleStickyEnter, true);
        document.removeEventListener('mouseleave', handleStickyLeave, true);
        document.removeEventListener('mouseenter', handleMagneticEnter, true);
        document.removeEventListener('mouseleave', handleMagneticLeave, true);
      };
    }, [
      mouseX,
      mouseY,
      isSticky,
      isMagnetic,
      stickyElements,
      magneticElements,
      magneticForce,
      size,
      borderRadius,
      disabled,
      hideOnLeave,
    ]);

    if (disabled) return null;

    return (
      <motion.div
        ref={(node) => {
          cursorRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn('pointer-events-none fixed left-0 top-0', className)}
        style={{
          ...style,
          width: size,
          height: size,
          x: springX,
          y: springY,
          filter: `blur(${blur}px)`,
          backgroundColor,
          borderWidth,
          borderColor,
          borderStyle,
          borderRadius,
          mixBlendMode,
          opacity: isVisible ? opacity : 0,
          zIndex,
          transform: 'translate(-50%, -50%)',
          transition: `opacity ${transitionDuration}s ${transitionTimingFunction}`,
        }}
      />
    );
  }
);

Cursor.displayName = 'Cursor'; 