'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, useScroll, useSpring, HTMLMotionProps } from 'framer-motion';

export interface ToolbarDynamicProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode;
  className?: string;
  position?: 'top' | 'bottom';
  scrollThreshold?: number;
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

export const ToolbarDynamic = React.forwardRef<HTMLDivElement, ToolbarDynamicProps>(({
  children,
  className,
  position = 'top',
  scrollThreshold = 50,
  spring = defaultSpring,
  ...props
}, ref) => {
  const { scrollY } = useScroll();
  const smoothY = useSpring(scrollY, spring);

  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    return smoothY.on('change', (latest) => {
      if (latest > scrollThreshold) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    });
  }, [smoothY, scrollThreshold]);

  return (
    <motion.div
      ref={ref}
      className={cn(
        'fixed left-0 right-0 z-50',
        position === 'top' ? 'top-0' : 'bottom-0',
        className
      )}
      initial={{ opacity: 1, y: 0 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : position === 'top' ? -100 : 100
      }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
});

ToolbarDynamic.displayName = 'ToolbarDynamic'; 