'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps, Variants } from 'framer-motion';

interface TextRollProps extends Omit<HTMLMotionProps<'span'>, 'animate' | 'transition'> {
  direction?: 'up' | 'down';
  delay?: number;
  staggerChildren?: number;
  ease?: string;
}

const createRollVariants = (direction: 'up' | 'down'): Variants => ({
  initial: {
    y: direction === 'up' ? '100%' : '-100%',
    opacity: 0
  },
  animate: {
    y: 0,
    opacity: 1
  },
  exit: {
    y: direction === 'up' ? '-100%' : '100%',
    opacity: 0
  }
});

export const TextRoll = React.forwardRef<HTMLSpanElement, TextRollProps>(({
  children,
  className,
  style,
  direction = 'up',
  delay = 0,
  staggerChildren = 0.05,
  ease = 'easeOut',
  ...props
}, ref) => {
  const variants = createRollVariants(direction);
  const chars = React.useMemo(() => {
    return String(children).split('');
  }, [children]);

  return (
    <motion.span
      ref={ref}
      className={cn('inline-block', className)}
      style={style}
      {...props}
    >
      {chars.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            duration: 0.5,
            ease,
            delay: delay + i * staggerChildren
          }}
          className="inline-block"
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
});

TextRoll.displayName = 'TextRoll'; 