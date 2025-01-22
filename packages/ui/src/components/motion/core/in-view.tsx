'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps, Variants, useInView } from 'framer-motion';

interface InViewProps extends Omit<HTMLMotionProps<'div'>, 'animate' | 'initial'> {
  variants?: Variants;
  viewport?: {
    margin?: `${number}px ${number}px ${number}px ${number}px`;
    amount?: 'some' | 'all' | number;
    once?: boolean;
  };
}

const defaultVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export const InView = React.forwardRef<HTMLDivElement, InViewProps>(({
  children,
  className,
  style,
  variants = defaultVariants,
  viewport = {
    margin: '0px 0px -200px 0px',
    amount: 'some',
  },
  ...props
}, ref) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, viewport);

  return (
    <motion.div
      ref={(node) => {
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
        containerRef.current = node;
      }}
      className={cn(className)}
      style={style}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      {...props}
    >
      {children}
    </motion.div>
  );
});

InView.displayName = 'InView'; 