'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, Variants } from 'framer-motion';

export interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  overlayClassName?: string;
  overlayStyle?: React.CSSProperties;
  contentClassName?: string;
  contentStyle?: React.CSSProperties;
  overlayVariants?: Variants;
  contentVariants?: Variants;
  initialFocus?: React.RefObject<HTMLElement>;
  finalFocus?: React.RefObject<HTMLElement>;
  preventScroll?: boolean;
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
}

const defaultOverlayVariants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

const defaultContentVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(({
  children,
  className,
  style,
  isOpen,
  onOpenChange,
  overlayClassName,
  overlayStyle,
  contentClassName,
  contentStyle,
  overlayVariants = defaultOverlayVariants,
  contentVariants = defaultContentVariants,
  initialFocus,
  finalFocus,
  preventScroll = true,
  closeOnEscape = true,
  closeOnOverlayClick = true,
}, ref) => {
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const [lastActiveElement] = React.useState(() => typeof document !== 'undefined' ? document.activeElement : null);

  React.useEffect(() => {
    if (isOpen) {
      const element = initialFocus?.current || dialogRef.current;
      element?.focus();

      if (preventScroll) {
        document.body.style.overflow = 'hidden';
      }
    } else {
      if (finalFocus?.current) {
        finalFocus.current.focus();
      } else if (lastActiveElement instanceof HTMLElement) {
        lastActiveElement.focus();
      }

      if (preventScroll) {
        document.body.style.overflow = '';
      }
    }
  }, [isOpen, initialFocus, finalFocus, lastActiveElement, preventScroll]);

  React.useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onOpenChange) {
        onOpenChange(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onOpenChange, closeOnEscape]);

  const handleOverlayClick = React.useCallback(() => {
    if (closeOnOverlayClick && onOpenChange) {
      onOpenChange(false);
    }
  }, [closeOnOverlayClick, onOpenChange]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          ref={ref}
          className={cn('fixed inset-0 z-50', className)}
          style={style}
          role="presentation"
        >
          <motion.div
            className={cn(
              'fixed inset-0 bg-black/50 backdrop-blur-sm',
              overlayClassName
            )}
            style={overlayStyle}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
            onClick={handleOverlayClick}
            aria-hidden="true"
          />
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                tabIndex={-1}
                className={cn(
                  'relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl focus:outline-none',
                  contentClassName
                )}
                style={contentStyle}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={contentVariants}
              >
                {children}
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
});

Dialog.displayName = 'Dialog';

export interface DialogTriggerProps {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}

export interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
  container?: HTMLElement;
  onOpenAutoFocus?: () => void;
  onCloseAutoFocus?: () => void;
}

export interface DialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export interface DialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export interface DialogCloseProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

const DialogContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  titleId?: string;
  descriptionId?: string;
}>({
  open: false,
  onOpenChange: () => {},
});

export function DialogTrigger({ children, className, asChild = false }: DialogTriggerProps): React.ReactElement {
  const { onOpenChange } = React.useContext(DialogContext);
  
  if (asChild) {
    return (
      <span className={className} onClick={() => onOpenChange(true)}>
        {children}
      </span>
    );
  }
  
  return (
    <button
      type="button"
      className={className}
      onClick={() => onOpenChange(true)}
    >
      {children}
    </button>
  );
}

export function DialogContent({ 
  children,
  className,
  container = typeof document !== 'undefined' ? document.body : undefined,
  onOpenAutoFocus,
  onCloseAutoFocus,
}: DialogContentProps): React.ReactElement | null {
  const { open, titleId, descriptionId } = React.useContext(DialogContext);
  
  if (!container) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black"
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            className={className}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', duration: 0.3 }}
            onAnimationStart={() => {
              if (onOpenAutoFocus) {
                onOpenAutoFocus();
              }
            }}
            onAnimationComplete={() => {
              if (onCloseAutoFocus) {
                onCloseAutoFocus();
              }
            }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function DialogHeader({ children, className }: DialogHeaderProps): React.ReactElement {
  return <div className={cn('flex flex-col space-y-1.5', className)}>{children}</div>;
}

export function DialogTitle({ children, className, id }: DialogTitleProps): React.ReactElement {
  const { titleId } = React.useContext(DialogContext);
  const finalId = id ?? titleId;

  return (
    <h2 id={finalId} className={cn('text-lg font-semibold', className)}>
      {children}
    </h2>
  );
}

export function DialogDescription({ children, className, id }: DialogDescriptionProps): React.ReactElement {
  const { descriptionId } = React.useContext(DialogContext);
  const finalId = id ?? descriptionId;

  return (
    <p id={finalId} className={cn('text-sm text-gray-500', className)}>
      {children}
    </p>
  );
}

export function DialogClose({ children, className, disabled }: DialogCloseProps): React.ReactElement {
  const { onOpenChange } = React.useContext(DialogContext);
  
  return (
    <button
      type="button"
      className={cn(
        'absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none',
        className
      )}
      onClick={() => onOpenChange(false)}
      disabled={disabled}
    >
      {children || (
        <span className="h-4 w-4">×</span>
      )}
      <span className="sr-only">Close</span>
    </button>
  );
} 