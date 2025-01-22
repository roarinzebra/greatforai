'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export interface PopoverProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
  className?: string;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  offset?: number;
  arrow?: boolean;
  arrowSize?: number;
  arrowOffset?: number;
  spring?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
  content?: {
    className?: string;
    style?: React.CSSProperties;
    initial?: Record<string, any>;
    animate?: Record<string, any>;
    exit?: Record<string, any>;
    transition?: Record<string, any>;
  };
  closeOnEscape?: boolean;
  closeOnClickOutside?: boolean;
}

const defaultSpring: Required<PopoverProps['spring']> = {
  stiffness: 400,
  damping: 30,
  mass: 1,
};

const defaultContent: Required<PopoverProps['content']> = {
  className: 'bg-white rounded-lg shadow-xl p-4',
  style: { zIndex: 50 },
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.15 },
};

export const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(
  ({ 
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
    content = defaultContent,
    closeOnEscape = true,
    closeOnClickOutside = true,
  }, ref) => {
    const [uncontrolledIsOpen, setUncontrolledIsOpen] = React.useState(false);
    const isOpen = controlledIsOpen ?? uncontrolledIsOpen;
    const triggerRef = React.useRef<HTMLDivElement>(null);
    const popoverRef = React.useRef<HTMLDivElement>(null);
    const [position, setPosition] = React.useState({ x: 0, y: 0 });

    const updatePosition = React.useCallback(() => {
      if (!triggerRef.current) return;

      const rect = triggerRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      let popoverX = x;
      let popoverY = y;

      switch (placement) {
        case 'top':
          popoverY = rect.top - offset;
          break;
        case 'bottom':
          popoverY = rect.bottom + offset;
          break;
        case 'left':
          popoverX = rect.left - offset;
          break;
        case 'right':
          popoverX = rect.right + offset;
          break;
      }

      setPosition({ x: popoverX, y: popoverY });
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

    const handleToggle = () => {
      const newIsOpen = !isOpen;
      onOpenChange?.(newIsOpen);
      setUncontrolledIsOpen(newIsOpen);
    };

    const getArrowStyle = () => {
      const baseStyle: React.CSSProperties = {
        position: 'absolute',
        width: 0,
        height: 0,
      };

      switch (placement) {
        case 'top':
          return {
            ...baseStyle,
            bottom: -arrowSize,
            left: `calc(50% - ${arrowSize}px)`,
            borderLeft: `${arrowSize}px solid transparent`,
            borderRight: `${arrowSize}px solid transparent`,
            borderTop: `${arrowSize}px solid white`,
            transform: `translateX(${arrowOffset}px)`,
          };
        case 'bottom':
          return {
            ...baseStyle,
            top: -arrowSize,
            left: `calc(50% - ${arrowSize}px)`,
            borderLeft: `${arrowSize}px solid transparent`,
            borderRight: `${arrowSize}px solid transparent`,
            borderBottom: `${arrowSize}px solid white`,
            transform: `translateX(${arrowOffset}px)`,
          };
        case 'left':
          return {
            ...baseStyle,
            right: -arrowSize,
            top: `calc(50% - ${arrowSize}px)`,
            borderTop: `${arrowSize}px solid transparent`,
            borderBottom: `${arrowSize}px solid transparent`,
            borderLeft: `${arrowSize}px solid white`,
            transform: `translateY(${arrowOffset}px)`,
          };
        case 'right':
          return {
            ...baseStyle,
            left: -arrowSize,
            top: `calc(50% - ${arrowSize}px)`,
            borderTop: `${arrowSize}px solid transparent`,
            borderBottom: `${arrowSize}px solid transparent`,
            borderRight: `${arrowSize}px solid white`,
            transform: `translateY(${arrowOffset}px)`,
          };
      }
    };

    return (
      <>
        <div ref={triggerRef} onClick={handleToggle}>
          {trigger}
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={ref}
              className={cn(content.className, className)}
              style={{
                position: 'fixed',
                left: position.x,
                top: position.y,
                transform: 'translate(-50%, -50%)',
                ...content.style,
              }}
              initial={content.initial}
              animate={content.animate}
              exit={content.exit}
              transition={{
                ...spring,
                ...content.transition,
              }}
            >
              {children}
              {arrow && <div style={getArrowStyle()} />}
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }
);

Popover.displayName = 'Popover'; 