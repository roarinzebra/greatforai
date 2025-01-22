'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps, useSpring, useTransform } from 'framer-motion';

interface AnimatedNumberProps extends Omit<HTMLMotionProps<'span'>, 'animate' | 'initial'> {
  value: number;
  formatOptions?: Intl.NumberFormatOptions;
  springConfig?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
}

export const AnimatedNumber = React.forwardRef<HTMLSpanElement, AnimatedNumberProps>(({
  className,
  style,
  value,
  formatOptions = {},
  springConfig = {
    stiffness: 100,
    damping: 30,
    mass: 1,
  },
  ...props
}, ref) => {
  const springValue = useSpring(value, springConfig);
  const formatter = new Intl.NumberFormat(undefined, formatOptions);
  const displayValue = useTransform(springValue, (latest) => formatter.format(latest));

  React.useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  return (
    <motion.span
      ref={ref}
      className={cn(className)}
      style={style}
      {...props}
    >
      {displayValue}
    </motion.span>
  );
});

AnimatedNumber.displayName = 'AnimatedNumber'; 