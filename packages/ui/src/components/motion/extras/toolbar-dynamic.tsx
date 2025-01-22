'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface ToolbarDynamicProps {
  children: React.ReactNode;
  className?: string;
  position?: 'top' | 'bottom';
  scrollThreshold?: number;
  spring?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
  onVisibilityChange?: (visible: boolean) => void;
  style?: React.CSSProperties;
}

const defaultSpring: Required<ToolbarDynamicProps['spring']> = {
  stiffness: 400,
  damping: 30,
  mass: 1,
};

export const ToolbarDynamic = React.forwardRef<HTMLDivElement, ToolbarDynamicProps>(
  ({ 
    children,
    className,
    position = 'top',
    scrollThreshold = 50,
    spring = defaultSpring,
    onVisibilityChange,
    style,
  }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true);
    const [lastScrollY, setLastScrollY] = React.useState(0);

    React.useEffect(() => {
      const handleScroll = () => {
        const currentScrollY = window.scrollY;
        const scrollDelta = currentScrollY - lastScrollY;
        const shouldBeVisible = position === 'top'
          ? scrollDelta < -scrollThreshold || currentScrollY <= 0
          : scrollDelta > scrollThreshold || currentScrollY >= document.documentElement.scrollHeight - window.innerHeight;

        if (shouldBeVisible !== isVisible) {
          setIsVisible(shouldBeVisible);
          onVisibilityChange?.(shouldBeVisible);
        }

        setLastScrollY(currentScrollY);
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }, [isVisible, lastScrollY, onVisibilityChange, position, scrollThreshold]);

    return (
      <motion.div
        ref={ref}
        className={cn(
          'fixed left-0 right-0 z-50',
          position === 'top' ? 'top-0' : 'bottom-0',
          className
        )}
        style={style}
        initial={false}
        animate={{
          y: isVisible ? 0 : position === 'top' ? -100 : 100,
        }}
        transition={spring}
      >
        {children}
      </motion.div>
    );
  }
);

ToolbarDynamic.displayName = 'ToolbarDynamic'; 