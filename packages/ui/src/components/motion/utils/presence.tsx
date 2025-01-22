'use client';

import * as React from 'react';
import { AnimatePresence } from 'framer-motion';

export interface PresenceProps {
  children: React.ReactNode;
  custom?: unknown;
  presenceAffectsLayout?: boolean;
  mode?: 'sync' | 'wait' | 'popLayout';
  initial?: boolean;
}

export const Presence = ({
  children,
  custom,
  presenceAffectsLayout,
  mode,
  initial,
}: PresenceProps): React.JSX.Element => {
  return (
    <AnimatePresence
      custom={custom}
      presenceAffectsLayout={presenceAffectsLayout}
      mode={mode}
      initial={initial}
    >
      {children}
    </AnimatePresence>
  );
};

Presence.displayName = 'Presence'; 