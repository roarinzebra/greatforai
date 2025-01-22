'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export interface MorphingDialogProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
  className?: string;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  transition?: {
    duration?: number;
    ease?: [number, number, number, number];
  };
  overlay?: {
    className?: string;
    style?: React.CSSProperties;
    initial?: Record<string, any>;
    animate?: Record<string, any>;
    exit?: Record<string, any>;
    transition?: Record<string, any>;
  };
  content?: {
    className?: string;
    style?: React.CSSProperties;
    initial?: Record<string, any>;
    animate?: Record<string, any>;
    exit?: Record<string, any>;
    transition?: Record<string, any>;
  };
  preventScroll?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

const defaultTransition: Required<MorphingDialogProps['transition']> = {
  duration: 0.5,
  ease: [0.16, 1, 0.3, 1],
};

const defaultOverlay: Required<MorphingDialogProps['overlay']> = {
  className: 'fixed inset-0 bg-black/50 backdrop-blur-sm',
  style: {},
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.15 },
};

const defaultContent: Required<MorphingDialogProps['content']> = {
  className: 'bg-white rounded-lg shadow-xl',
  style: { zIndex: 51 },
  initial: {},
  animate: {},
  exit: {},
  transition: {},
};

export const MorphingDialog = React.forwardRef<HTMLDivElement, MorphingDialogProps>(
  ({ 
    children,
    trigger,
    className,
    isOpen = false,
    onOpenChange,
    transition = defaultTransition,
    overlay = defaultOverlay,
    content = defaultContent,
    preventScroll = true,
    closeOnOverlayClick = true,
    closeOnEscape = true,
  }, ref) => {
    const triggerRef = React.useRef<HTMLDivElement>(null);
    const [triggerRect, setTriggerRect] = React.useState<DOMRect | null>(null);

    const updateTriggerRect = React.useCallback(() => {
      if (triggerRef.current) {
        setTriggerRect(triggerRef.current.getBoundingClientRect());
      }
    }, []);

    React.useEffect(() => {
      updateTriggerRect();
      window.addEventListener('resize', updateTriggerRect);
      return () => window.removeEventListener('resize', updateTriggerRect);
    }, [updateTriggerRect]);

    React.useEffect(() => {
      if (preventScroll && isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      return () => {
        document.body.style.overflow = '';
      };
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
    }, [isOpen, onOpenChange, closeOnEscape]);

    const handleOpen = () => {
      updateTriggerRect();
      onOpenChange?.(true);
    };

    const handleClose = () => {
      if (closeOnOverlayClick) {
        onOpenChange?.(false);
      }
    };

    return (
      <>
        <div ref={triggerRef} onClick={handleOpen}>
          {trigger}
        </div>
        <AnimatePresence>
          {isOpen && triggerRect && (
            <>
              <motion.div
                className={cn(overlay.className)}
                style={overlay.style}
                initial={overlay.initial}
                animate={overlay.animate}
                exit={overlay.exit}
                transition={overlay.transition}
                onClick={handleClose}
              />
              <motion.div
                ref={ref}
                className={cn(content.className, className)}
                style={{
                  position: 'fixed',
                  ...content.style,
                }}
                initial={{
                  x: triggerRect.left,
                  y: triggerRect.top,
                  width: triggerRect.width,
                  height: triggerRect.height,
                  ...content.initial,
                }}
                animate={{
                  x: '50%',
                  y: '50%',
                  width: 'min(90vw, 600px)',
                  height: 'min(90vh, 400px)',
                  transform: 'translate(-50%, -50%)',
                  ...content.animate,
                }}
                exit={{
                  x: triggerRect.left,
                  y: triggerRect.top,
                  width: triggerRect.width,
                  height: triggerRect.height,
                  ...content.exit,
                }}
                transition={{
                  ...transition,
                  ...content.transition,
                }}
              >
                {children}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }
);

MorphingDialog.displayName = 'MorphingDialog'; 