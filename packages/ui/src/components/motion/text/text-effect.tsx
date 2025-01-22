'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  motion,
  TargetAndTransition,
  type HTMLMotionProps,
  type DOMMotionComponents,
  type ForwardRefComponent,
  type Spring,
  type Tween
} from 'framer-motion';

export type TextVariants = {
  hidden: TargetAndTransition;
  visible: TargetAndTransition;
  exit: TargetAndTransition;
};

export type PresetType = 'fade' | 'slide' | 'scale' | 'rotate' | 'flip';

type MotionComponentType = keyof DOMMotionComponents;

type TextTransition = Spring | Tween | (Spring & Tween);

export interface TextEffectProps extends Omit<HTMLMotionProps<'span'>, 'children' | 'transition' | 'variants'> {
  children: string;
  preset?: PresetType;
  per?: 'char' | 'word' | 'line';
  as?: MotionComponentType;
  segmentWrapperClassName?: string;
  variants?: TextVariants;
  transition?: TextTransition;
  delay?: number;
  trigger?: boolean;
  onAnimationComplete?: () => void;
  onAnimationStart?: () => void;
  _speedReveal?: number;
  speedSegment?: number;
}

const defaultVariants: TextVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const presetVariants: Record<PresetType, TextVariants> = {
  fade: defaultVariants,
  slide: {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
  },
  scale: {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 }
  },
  rotate: {
    hidden: { rotate: -180, opacity: 0 },
    visible: { rotate: 0, opacity: 1 },
    exit: { rotate: 180, opacity: 0 }
  },
  flip: {
    hidden: { rotateX: -180, opacity: 0 },
    visible: { rotateX: 0, opacity: 1 },
    exit: { rotateX: 180, opacity: 0 }
  }
};

const createVariantsWithTransition = (variants: TextVariants, transition: TextTransition): TextVariants => ({
  hidden: { ...variants.hidden, transition },
  visible: { ...variants.visible, transition },
  exit: { ...variants.exit, transition }
});

interface AnimationComponentProps {
  segment: string;
  variants: TextVariants;
  per: 'char' | 'word' | 'line';
  segmentWrapperClassName?: string;
}

const AnimationComponent: React.FC<AnimationComponentProps> = ({
  segment,
  variants,
  per,
  segmentWrapperClassName
}) => {
  if (per === 'char') {
    return (
      <motion.span className={cn('inline-block', segmentWrapperClassName)}>
        {segment.split('').map((char, index) => (
          <motion.span
            key={index}
            className="inline-block"
            variants={variants}
          >
            {char}
          </motion.span>
        ))}
      </motion.span>
    );
  }

  return (
    <motion.span
      className={cn('inline-block', segmentWrapperClassName)}
      variants={variants}
    >
      {segment}
    </motion.span>
  );
};

export const TextEffect = React.forwardRef<HTMLSpanElement, TextEffectProps>(({
  children,
  className,
  style,
  preset = 'fade',
  per = 'char',
  as = 'span',
  segmentWrapperClassName,
  variants: customVariants,
  delay = 0,
  trigger = true,
  onAnimationComplete,
  onAnimationStart,
  _speedReveal = 1,
  speedSegment = 1,
  ...props
}, ref) => {
  const variants = React.useMemo(() => {
    const baseVariants = customVariants || presetVariants[preset] || defaultVariants;
    const withTransition = props.transition ? createVariantsWithTransition(baseVariants, props.transition) : baseVariants;
    const tweenTransition = props.transition && 'type' in props.transition && props.transition.type === 'tween' && 'duration' in props.transition ? props.transition : null;
    
    return {
      hidden: { ...withTransition.hidden },
      visible: {
        ...withTransition.visible,
        transition: {
          ...withTransition.visible?.transition,
          delay,
          ...(tweenTransition && tweenTransition.duration ? {
            duration: tweenTransition.duration / _speedReveal
          } : {}),
          staggerChildren: withTransition.visible?.transition?.staggerChildren 
            ? withTransition.visible.transition.staggerChildren / speedSegment 
            : undefined
        }
      },
      exit: { ...withTransition.exit }
    };
  }, [preset, props.transition, customVariants, delay, _speedReveal, speedSegment]);

  const segments = React.useMemo(() => {
    return per === 'line' ? children.split('\n') : children.split(/(\s+)/);
  }, [children, per]);

  const MotionComponent = motion[as] as ForwardRefComponent<HTMLSpanElement, HTMLMotionProps<"span">>;

  return (
    <MotionComponent
      ref={ref}
      className={cn('inline-block', className)}
      style={style}
      initial="hidden"
      animate={trigger ? "visible" : "hidden"}
      exit="exit"
      variants={variants}
      onAnimationComplete={onAnimationComplete}
      onAnimationStart={onAnimationStart}
      {...props}
    >
      {segments.map((segment, index) => (
        <AnimationComponent
          key={`${segment}-${index}`}
          segment={segment}
          variants={variants}
          per={per}
          segmentWrapperClassName={segmentWrapperClassName}
        />
      ))}
    </MotionComponent>
  );
});

TextEffect.displayName = 'TextEffect'; 