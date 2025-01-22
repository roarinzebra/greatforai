'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface ToolbarExpandableProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
  className?: string;
  position?: 'top' | 'bottom';
  expandDirection?: 'up' | 'down';
  expandedHeight?: number | string;
  collapsedHeight?: number | string;
  spring?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
  onExpandChange?: (expanded: boolean) => void;
  style?: React.CSSProperties;
}

const defaultSpring: Required<ToolbarExpandableProps['spring']> = {
  stiffness: 400,
  damping: 30,
  mass: 1,
};

export const ToolbarExpandable = React.forwardRef<HTMLDivElement, ToolbarExpandableProps>(
  ({ 
    children,
    trigger,
    className,
    position = 'bottom',
    expandDirection = 'up',
    expandedHeight = 'auto',
    collapsedHeight = 64,
    spring = defaultSpring,
    onExpandChange,
    style,
  }, ref) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    const handleToggle = () => {
      const newExpanded = !isExpanded;
      setIsExpanded(newExpanded);
      onExpandChange?.(newExpanded);
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          'fixed left-0 right-0 z-50 overflow-hidden',
          position === 'top' ? 'top-0' : 'bottom-0',
          className
        )}
        style={style}
        animate={{
          height: isExpanded ? expandedHeight : collapsedHeight,
          ...(expandDirection === 'up' && {
            y: isExpanded ? -(typeof expandedHeight === 'number' ? expandedHeight : 0) : 0,
          }),
        }}
        transition={spring}
      >
        <motion.div
          className="cursor-pointer"
          style={{
            height: typeof collapsedHeight === 'number' ? `${collapsedHeight}px` : collapsedHeight,
          }}
          onClick={handleToggle}
        >
          {trigger}
        </motion.div>
        <motion.div
          className="overflow-hidden"
          animate={{
            height: isExpanded ? 'auto' : 0,
            opacity: isExpanded ? 1 : 0,
          }}
          transition={spring}
        >
          {children}
        </motion.div>
      </motion.div>
    );
  }
);

ToolbarExpandable.displayName = 'ToolbarExpandable'; 