'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export interface MorphingDialogProps {
  children?: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
  preventScroll?: boolean;
  overlay?: {
    className?: string;
    style?: React.CSSProperties;
  };
  content?: {
    className?: string;
    style?: React.CSSProperties;
  };
}

export const MorphingDialog = React.forwardRef<HTMLDivElement, MorphingDialogProps>(
  ({
    className,
    children,
    isOpen,
    onOpenChange,
    closeOnEscape = true,
    closeOnOverlayClick = true,
    preventScroll = true,
    overlay = {},
    content = {},
  }, ref) => {
    React.useEffect(() => {
      if (preventScroll) {
        if (isOpen) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
      }
    }, [isOpen, preventScroll]);

    React.useEffect(() => {
      if (!closeOnEscape) return;

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) {
          onOpenChange?.(false);
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, closeOnEscape, onOpenChange]);

    const handleOverlayClick = React.useCallback(() => {
      if (closeOnOverlayClick) {
        onOpenChange?.(false);
      }
    }, [closeOnOverlayClick, onOpenChange]);

    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={ref}
            className={cn('fixed inset-0 z-50', className)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={cn('absolute inset-0 bg-black/50', overlay.className)}
              style={overlay.style}
              onClick={handleOverlayClick}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className={cn(
                'absolute left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl',
                content.className
              )}
              style={content.style}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

MorphingDialog.displayName = 'MorphingDialog'; 