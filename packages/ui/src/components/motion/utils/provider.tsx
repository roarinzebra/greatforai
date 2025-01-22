'use client';

import * as React from 'react';
import { MotionConfig } from 'framer-motion';

export interface MotionProviderProps {
  children: React.ReactNode;
  reducedMotion?: 'always' | 'never' | 'user';
  transition?: {
    type?: 'tween' | 'spring';
    duration?: number;
    stiffness?: number;
    damping?: number;
    mass?: number;
    bounce?: number;
  };
}

const defaultTransition = {
  type: 'tween' as const,
  duration: 0.2,
  stiffness: 100,
  damping: 10,
  mass: 1,
  bounce: 0,
};

export function MotionProvider({ 
  children,
  reducedMotion = 'never',
  transition = defaultTransition,
}: MotionProviderProps) {
  return (
    <MotionConfig
      reducedMotion={reducedMotion}
      transition={transition}
    >
      {children}
    </MotionConfig>
  );
} 