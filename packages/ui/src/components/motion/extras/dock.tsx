'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, useMotionValue, HTMLMotionProps } from 'framer-motion';

export interface DockProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children?: React.ReactNode;
  magnification?: number;
  panelHeight?: number;
}

export interface DockItemProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode;
  className?: string;
}

export interface DockLabelProps {
  children: React.ReactNode;
  className?: string;
}

export interface DockIconProps {
  children: React.ReactNode;
  className?: string;
}

export const DockItem = React.forwardRef<HTMLDivElement, DockItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn('relative flex items-center justify-center', className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

DockItem.displayName = 'DockItem';

export const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  ({
    className,
    magnification = 2,
    panelHeight = 48,
    children,
    ...props
  }, ref) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = React.useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      },
      [mouseX, mouseY]
    );

    const handleMouseLeave = React.useCallback(() => {
      mouseX.set(0);
      mouseY.set(0);
    }, [mouseX, mouseY]);

    return (
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn('flex gap-4 rounded-lg bg-background/50 p-4 backdrop-blur', className)}
        style={{ height: panelHeight }}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return null;

          return React.cloneElement(child as React.ReactElement<DockItemProps>, {
            style: {
              transform: `scale(${magnification})`,
              transition: 'transform 0.2s ease',
            },
          });
        })}
      </motion.div>
    );
  }
);

Dock.displayName = 'Dock';

export const DockLabel = React.forwardRef<HTMLDivElement, DockLabelProps>(
  ({ children, className }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          'px-3 py-1 bg-black/50 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity',
          className
        )}
      >
        {children}
      </motion.div>
    );
  }
);

export const DockIcon = React.forwardRef<HTMLDivElement, DockIconProps>(
  ({ children, className }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn('w-12 h-12 flex items-center justify-center', className)}
      >
        {children}
      </motion.div>
    );
  }
);

DockLabel.displayName = 'DockLabel';
DockIcon.displayName = 'DockIcon'; 