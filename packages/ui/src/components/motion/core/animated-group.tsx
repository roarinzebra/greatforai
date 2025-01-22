'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps, useInView, Variants, UseInViewOptions } from 'framer-motion';

interface BaseProps extends Omit<HTMLMotionProps<'div'>, 'animate' | 'initial'> {
  variants?: Variants;
  viewport?: UseInViewOptions;
}

interface AnimatedGroupProps extends BaseProps {
  preset?: 'fade' | 'scale' | 'slide' | 'rotate';
  direction?: 'up' | 'down' | 'left' | 'right';
}

const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const scaleVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
};

const rotateVariants: Variants = {
  hidden: { rotate: -180, opacity: 0 },
  visible: { rotate: 0, opacity: 1 },
};

const createSlideVariants = (direction: 'up' | 'down' | 'left' | 'right'): Variants => {
  const offset = 50;
  const directionOffset = {
    up: { y: offset },
    down: { y: -offset },
    left: { x: offset },
    right: { x: -offset },
  };

  return {
    hidden: {
      opacity: 0,
      ...directionOffset[direction],
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
    },
  };
};

export const AnimatedGroup = React.forwardRef<HTMLDivElement, AnimatedGroupProps>(({
  children,
  className,
  style,
  preset = 'fade',
  direction = 'up',
  viewport = {
    margin: '0px 0px -200px 0px',
    amount: 'some',
  },
  variants,
  transition,
  ...props
}, ref) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, viewport);

  return (
    <motion.div
      ref={(node) => {
        containerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      className={cn('relative', className)}
      style={style}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants || (preset === 'slide' ? createSlideVariants(direction) : preset === 'scale' ? scaleVariants : preset === 'rotate' ? rotateVariants : fadeVariants)}
      transition={transition}
      {...props}
    >
      {children}
    </motion.div>
  );
});

AnimatedGroup.displayName = 'AnimatedGroup'; 