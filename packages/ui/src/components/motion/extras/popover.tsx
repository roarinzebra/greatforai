'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, Variants, Transition } from 'framer-motion';

export interface PopoverProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
  className?: string;
  isOpen: boolean | undefined;
  onOpenChange?: (isOpen: boolean) => void;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  offset?: number;
  arrow?: boolean;
  arrowSize?: number;
  arrowOffset?: number;
  spring?: Transition;
  content?: {
    className?: string;
    style?: React.CSSProperties;
    variants?: Variants;
    transition?: Transition;
  };
  closeOnEscape?: boolean;
  closeOnClickOutside?: boolean;
}

const defaultSpring: Transition = {
  type: 'spring',
  stiffness: 500,
  damping: 30,
  mass: 1
};

const defaultVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 }
};

const getPlacementStyles = (placement: PopoverProps['placement'], offset: number = 8): React.CSSProperties => {
  switch (placement) {
    case 'top':
      return { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: offset };
    case 'right':
      return { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: offset };
    case 'bottom':
      return { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: offset };
    case 'left':
      return { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: offset };
    default:
      return { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: offset };
  }
};

export const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(({
  children,
  trigger,
  className,
  isOpen: controlledIsOpen,
  onOpenChange,
  placement = 'bottom',
  offset = 8,
  arrow = true,
  arrowSize = 8,
  arrowOffset = 12,
  spring = defaultSpring,
  content,
  closeOnEscape = true,
  closeOnClickOutside = true,
  ...props
}, ref) => {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = React.useState(false);
  const isOpen = controlledIsOpen ?? uncontrolledIsOpen;
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const popoverRef = React.useRef<HTMLDivElement>(null);

  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    
    switch (placement) {
      case 'top':
        rect.top - offset;
        break;
      case 'bottom':
        rect.bottom + offset;
        break;
      case 'left':
        rect.left - offset;
        break;
      case 'right':
        rect.right + offset;
        break;
    }

    setUncontrolledIsOpen(true);
  }, [offset, placement]);

  React.useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen, updatePosition]);

  React.useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onOpenChange?.(false);
        setUncontrolledIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onOpenChange, closeOnEscape]);

  React.useEffect(() => {
    if (!closeOnClickOutside || !isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !popoverRef.current?.contains(e.target as Node)
      ) {
        onOpenChange?.(false);
        setUncontrolledIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onOpenChange, closeOnClickOutside]);

  const getArrowStyles = (placement: PopoverProps['placement'], arrowSize: number, arrowOffset: number): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      width: 0,
      height: 0,
      borderStyle: 'solid',
      borderWidth: arrowSize,
      borderColor: 'transparent'
    };

    switch (placement) {
      case 'top':
        return {
          ...baseStyle,
          bottom: -arrowSize,
          left: `calc(50% - ${arrowSize}px)`,
          borderTopColor: 'currentColor',
          borderBottomWidth: 0,
          marginLeft: arrowOffset
        };
      case 'right':
        return {
          ...baseStyle,
          left: -arrowSize,
          top: `calc(50% - ${arrowSize}px)`,
          borderRightColor: 'currentColor',
          borderLeftWidth: 0,
          marginTop: arrowOffset
        };
      case 'bottom':
        return {
          ...baseStyle,
          top: -arrowSize,
          left: `calc(50% - ${arrowSize}px)`,
          borderBottomColor: 'currentColor',
          borderTopWidth: 0,
          marginLeft: arrowOffset
        };
      case 'left':
        return {
          ...baseStyle,
          right: -arrowSize,
          top: `calc(50% - ${arrowSize}px)`,
          borderLeftColor: 'currentColor',
          borderRightWidth: 0,
          marginTop: arrowOffset
        };
      default:
        return {
          ...baseStyle,
          top: -arrowSize,
          left: `calc(50% - ${arrowSize}px)`,
          borderBottomColor: 'currentColor',
          borderTopWidth: 0,
          marginLeft: arrowOffset
        };
    }
  };

  return (
    <div ref={ref} className={cn('relative inline-block', className)} {...props}>
      {trigger}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={cn(
              'absolute z-50',
              content?.className
            )}
            style={{
              ...getPlacementStyles(placement, offset),
              ...content?.style
            }}
            variants={content?.variants ?? defaultVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={content?.transition ?? spring}
          >
            {children}
            {arrow && (
              <motion.div
                className="absolute w-0 h-0"
                style={getArrowStyles(placement, arrowSize, arrowOffset)}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

Popover.displayName = 'Popover'; 