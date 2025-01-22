'use client';

import * as React from 'react';
import { MotionConfig } from 'framer-motion';

export interface MotionProviderProps {
  children: React.ReactNode;
  reducedMotion?: 'user' | 'never' | 'always';
  transition?: {
    type?: 'spring' | 'tween';
    duration?: number;
    bounce?: number;
    ease?: string;
    mass?: number;
    stiffness?: number;
    damping?: number;
  };
}

const defaultTransition = {
  type: 'spring' as const,
  duration: 0.3,
  bounce: 0.25,
  ease: 'easeInOut',
  mass: 1,
  stiffness: 150,
  damping: 30,
};

export const MotionProvider = ({
  children,
  reducedMotion = 'never',
  transition = defaultTransition,
}: MotionProviderProps): React.JSX.Element => {
  return (
    <MotionConfig
      reducedMotion={reducedMotion}
      transition={transition}
    >
      {children}
    </MotionConfig>
  );
};

MotionProvider.displayName = 'MotionProvider'; 