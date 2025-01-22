'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface ToolbarExpandableProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode;
  className?: string;
  position?: 'top' | 'bottom';
  expandDirection?: 'up' | 'down';
  expandedHeight?: number;
  collapsedHeight?: number;
  // eslint-disable-next-line no-unused-vars
  onExpandedChange?: (isExpanded: boolean) => void;
}

export const ToolbarExpandable = React.forwardRef<HTMLDivElement, ToolbarExpandableProps>(({
  children,
  className,
  position = 'top',
  expandDirection = 'down',
  expandedHeight = 200,
  collapsedHeight = 64,
  onExpandedChange,
  ...props
}, ref) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleClick = React.useCallback(() => {
    setIsExpanded((prev) => {
      const next = !prev;
      onExpandedChange?.(next);
      return next;
    });
  }, [onExpandedChange]);

  return (
    <motion.div
      ref={ref}
      className={cn(
        'fixed left-0 right-0 z-50',
        position === 'top' ? 'top-0' : 'bottom-0',
        className
      )}
      initial={{ height: collapsedHeight }}
      animate={{
        height: isExpanded ? expandedHeight : collapsedHeight,
        y: isExpanded && expandDirection === 'up' ? -expandedHeight + collapsedHeight : 0
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 50, mass: 0.5 }}
      onClick={handleClick}
      {...props}
    >
      {children}
    </motion.div>
  );
});

ToolbarExpandable.displayName = 'ToolbarExpandable'; 