'use client';

import * as React from 'react';
import { AnimatePresence } from 'framer-motion';

export interface PresenceProps {
  children: React.ReactNode;
  mode?: 'sync' | 'wait' | 'popLayout';
  initial?: boolean;
  onExitComplete?: () => void;
  custom?: any;
  presenceAffectsLayout?: boolean;
}

export function Presence({ 
  children,
  mode = 'sync',
  initial = true,
  onExitComplete,
  custom,
  presenceAffectsLayout = true,
}: PresenceProps) {
  return (
    <AnimatePresence
      mode={mode}
      initial={initial}
      onExitComplete={onExitComplete}
      custom={custom}
      presenceAffectsLayout={presenceAffectsLayout}
    >
      {children}
    </AnimatePresence>
  );
}

Presence.displayName = 'Presence'; 