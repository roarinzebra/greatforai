'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, useSpring, useTransform, useMotionValue, MotionValue } from 'framer-motion';

export interface DockProps {
  children: React.ReactNode;
  className?: string;
  spring?: {
    mass?: number;
    stiffness?: number;
    damping?: number;
  };
  magnification?: number;
  distance?: number;
  panelHeight?: number;
}

export interface DockItemProps {
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

const defaultSpring = {
  mass: 0.1,
  stiffness: 150,
  damping: 12,
};

export const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  ({ 
    children,
    className,
    spring = defaultSpring,
    magnification = 80,
    distance = 150,
    panelHeight = 64,
  }, ref) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          'fixed bottom-0 left-1/2 -translate-x-1/2 flex items-end justify-center gap-4 p-4 bg-black/5 backdrop-blur rounded-t-2xl',
          className
        )}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ height: panelHeight }}
      >
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return null;

          return (
            <DockItemWrapper
              key={index}
              mouseX={mouseX}
              mouseY={mouseY}
              index={index}
              spring={spring}
              magnification={magnification}
              distance={distance}
            >
              {child}
            </DockItemWrapper>
          );
        })}
      </motion.div>
    );
  }
);

interface DockItemWrapperProps {
  children: React.ReactElement;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  index: number;
  spring: NonNullable<DockProps['spring']>;
  magnification: number;
  distance: number;
}

const DockItemWrapper = ({
  children,
  mouseX,
  mouseY,
  index,
  spring,
  magnification,
  distance,
}: DockItemWrapperProps): React.JSX.Element => {
  const ref = React.useRef<HTMLDivElement>(null);

  const { width = 0, left = 0, top = 0 } = ref.current?.getBoundingClientRect() ?? {};
  const centerX = left + width / 2;

  const distanceFromMouseX = useTransform<number, number>(mouseX, (value) => {
    return value - centerX;
  });

  const distanceFromMouseY = useTransform<number, number>(mouseY, (value) => {
    return value - top;
  });

  const scale = useTransform(
    [distanceFromMouseX, distanceFromMouseY],
    (latest: number[]) => {
      const [x, y] = latest;
      const distanceFromMouse = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
      const scaleFactor = magnification / 100;
      const distanceRatio = Math.min(distanceFromMouse / distance, 1);
      return Math.max(1, 1 + scaleFactor * (1 - distanceRatio));
    }
  );

  const smoothScale = useSpring(scale, spring);

  return (
    <motion.div
      ref={ref}
      style={{ scale: smoothScale }}
      className="origin-bottom"
    >
      {children}
    </motion.div>
  );
};

export const DockItem = React.forwardRef<HTMLDivElement, DockItemProps>(
  ({ children, className }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn('flex flex-col items-center gap-1', className)}
      >
        {children}
      </motion.div>
    );
  }
);

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

Dock.displayName = 'Dock';
DockItem.displayName = 'DockItem';
DockLabel.displayName = 'DockLabel';
DockIcon.displayName = 'DockIcon'; 