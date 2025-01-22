'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface TextMorphProps extends Omit<HTMLMotionProps<'span'>, 'children'> {
  children: string[];
  interval?: number;
  transition?: {
    type?: string;
    duration?: number;
    ease?: string;
  };
  preserveSpaces?: boolean;
  preserveCharacters?: boolean;
}

export const TextMorph = React.forwardRef<HTMLSpanElement, TextMorphProps>(({
  children,
  className,
  style,
  interval = 2000,
  transition = {
    type: 'spring',
    duration: 0.5,
    ease: 'easeInOut',
  },
  preserveSpaces = true,
  preserveCharacters = true,
  ...props
}, ref) => {
  const [currentText, setCurrentText] = React.useState(children[0]);

  React.useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      index = (index + 1) % children.length;
      setCurrentText(children[index]);
    }, interval);

    return () => clearInterval(timer);
  }, [children, interval]);

  return (
    <motion.span
      ref={ref}
      className={cn(className)}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={transition}
      {...props}
    >
      {currentText}
    </motion.span>
  );
});

TextMorph.displayName = 'TextMorph'; 