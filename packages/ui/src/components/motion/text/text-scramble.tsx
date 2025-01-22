'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface TextScrambleProps extends Omit<HTMLMotionProps<'span'>, 'children'> {
  children: string;
  scrambleDuration?: number;
  scrambleSpeed?: number;
  preserveSpaces?: boolean;
  characterSet?: string;
}

export const TextScramble = React.forwardRef<HTMLSpanElement, TextScrambleProps>(({
  children,
  className,
  style,
  scrambleDuration = 1000,
  scrambleSpeed = 50,
  preserveSpaces = true,
  characterSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?',
  ...props
}, ref) => {
  const [displayText, setDisplayText] = React.useState(children);
  const frameId = React.useRef<number | null>(null);
  const startTime = React.useRef<number | null>(null);

  React.useEffect(() => {
    const scramble = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = timestamp - startTime.current;

      if (progress < scrambleDuration) {
        const targetLength = children.length;
        let scrambledText = '';

        for (let i = 0; i < targetLength; i++) {
          if (preserveSpaces && children[i] === ' ') {
            scrambledText += ' ';
          } else {
            const randomChar = characterSet[Math.floor(Math.random() * characterSet.length)];
            scrambledText += randomChar;
          }
        }

        setDisplayText(scrambledText);
        frameId.current = requestAnimationFrame(scramble);
      } else {
        setDisplayText(children);
      }
    };

    frameId.current = requestAnimationFrame(scramble);

    return () => {
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
    };
  }, [children, scrambleDuration, scrambleSpeed, preserveSpaces, characterSet]);

  return (
    <motion.span
      ref={ref}
      className={cn(className)}
      style={style}
      {...props}
    >
      {displayText}
    </motion.span>
  );
});

TextScramble.displayName = 'TextScramble'; 