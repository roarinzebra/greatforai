'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  AnimatePresence,
  motion,
  TargetAndTransition,
  Transition,
  Variant,
  Variants,
  type HTMLMotionProps,
} from 'framer-motion';

export type PresetType = 'blur' | 'fade-in-blur' | 'scale' | 'fade' | 'slide' | 'rotate' | 'flip' | 'bounce';
export type PerType = 'word' | 'char' | 'line';

type TextVariants = {
  hidden: TargetAndTransition;
  visible: TargetAndTransition;
  exit: TargetAndTransition;
};

interface TextEffectProps extends Omit<HTMLMotionProps<'span'>, 'children' | 'transition' | 'variants'> {
  children: string;
  per?: PerType;
  as?: keyof React.JSX.IntrinsicElements;
  variants?: TextVariants;
  className?: string;
  preset?: PresetType;
  delay?: number;
  speedReveal?: number;
  speedSegment?: number;
  trigger?: boolean;
  onAnimationComplete?: () => void;
  onAnimationStart?: () => void;
  segmentWrapperClassName?: string;
  containerTransition?: Transition;
  segmentTransition?: Transition;
  style?: React.CSSProperties;
  direction?: 'up' | 'down' | 'left' | 'right';
  staggerChildren?: number;
  staggerDirection?: 1 | -1;
  transition?: Transition;
}

const defaultStaggerTimes: Record<PerType, number> = {
  char: 0.03,
  word: 0.05,
  line: 0.1,
};

const defaultVariants: TextVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -20,
  }
};

const presetVariants: Record<PresetType, TextVariants> = {
  fade: defaultVariants,
  scale: {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
    },
    exit: {
      opacity: 0,
      scale: 0.8,
    }
  },
  rotate: {
    hidden: {
      opacity: 0,
      rotate: 0,
    },
    visible: {
      opacity: 1,
      rotate: 360,
    },
    exit: {
      opacity: 0,
      rotate: 0,
    }
  },
  blur: defaultVariants,
  'fade-in-blur': defaultVariants,
  slide: defaultVariants,
  flip: defaultVariants,
  bounce: defaultVariants
};

const AnimationComponent: React.FC<{
  segment: string;
  variants: TextVariants;
  per: PerType;
  segmentWrapperClassName?: string;
}> = React.memo(({ segment, variants, per, segmentWrapperClassName }) => {
  const content =
    per === 'line' ? (
      <motion.span variants={variants} className="block">
        {segment}
      </motion.span>
    ) : per === 'word' ? (
      <motion.span
        aria-hidden="true"
        variants={variants}
        className="inline-block whitespace-pre"
      >
        {segment}
      </motion.span>
    ) : (
      <motion.span className="inline-block whitespace-pre">
        {segment.split('').map((char, charIndex) => (
          <motion.span
            key={`char-${charIndex}`}
            aria-hidden="true"
            variants={variants}
            className="inline-block whitespace-pre"
          >
            {char}
          </motion.span>
        ))}
      </motion.span>
    );

  if (!segmentWrapperClassName) {
    return content;
  }

  const defaultWrapperClassName = per === 'line' ? 'block' : 'inline-block';

  return (
    <span className={cn(defaultWrapperClassName, segmentWrapperClassName)}>
      {content}
    </span>
  );
});

AnimationComponent.displayName = 'AnimationComponent';

const splitText = (text: string, per: PerType) => {
  if (per === 'line') return text.split('\n');
  return text.split(/(\s+)/);
};

const hasTransition = (variant: TargetAndTransition | undefined): variant is TargetAndTransition & { transition: Transition } => {
  return variant !== undefined && 'transition' in variant;
};

const getTransition = (variant: TargetAndTransition | undefined): Transition | undefined => {
  return hasTransition(variant) ? variant.transition : undefined;
};

const createVariantsWithTransition = (
  baseVariants: TextVariants,
  transition?: Transition & { exit?: Transition }
): TextVariants => {
  if (!transition) return baseVariants;

  const { exit: exitTransition, ...mainTransition } = transition;

  return {
    ...baseVariants,
    visible: {
      ...baseVariants.visible,
      transition: {
        ...getTransition(baseVariants.visible),
        ...mainTransition,
      },
    },
    exit: {
      ...baseVariants.exit,
      transition: {
        ...getTransition(baseVariants.exit),
        ...mainTransition,
        ...exitTransition,
        staggerDirection: -1,
      },
    },
    hidden: baseVariants.hidden
  };
};

export const TextEffect = React.forwardRef<HTMLSpanElement, TextEffectProps>(({
  children,
  className,
  style,
  preset = 'fade',
  direction = 'up',
  staggerChildren = 0.05,
  staggerDirection = 1,
  transition,
  ...props
}, ref) => {
  const variants = React.useMemo(() => {
    const baseVariants = presetVariants[preset] || defaultVariants;
    return transition ? createVariantsWithTransition(baseVariants, transition) : baseVariants;
  }, [preset, transition]);

  return (
    <motion.span
      ref={ref}
      className={cn('inline-block', className)}
      style={style}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      {...props}
    >
      {children}
    </motion.span>
  );
});

TextEffect.displayName = 'TextEffect'; 