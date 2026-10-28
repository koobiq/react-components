'use client';

import { useRef, type RefObject } from 'react';

import { useIsomorphicEffect, useMediaQuery } from '@koobiq/react-core';

const DEFAULT_DURATION = 100;

/**
 * Smoothly animates the block size of an element when `isExpanded` changes.
 * The new content is already rendered when the animation starts, so it only
 * animates the box between the heights before and after the change.
 * Returns a ref to the animation that is currently set up by the hook.
 */
export function useCollapseAnimation(
  ref: RefObject<HTMLElement | null>,
  isExpanded: boolean,
  duration = DEFAULT_DURATION
) {
  const lastRef = useRef<{ isExpanded: boolean; height: number }>(undefined);
  const animationRef = useRef<Animation>(undefined);

  const [prefersReducedMotion] = useMediaQuery([
    '(prefers-reduced-motion: reduce)',
  ]);

  // Runs after every commit to keep the last natural height up to date.
  useIsomorphicEffect(() => {
    const element = ref.current;

    if (!element) return;

    const last = lastRef.current;
    // Only the own animation matters: the consumer may animate the element too.
    const animation = animationRef.current;
    const isAnimating = animation?.playState === 'running';
    const currentHeight = element.getBoundingClientRect().height;

    if (!last || last.isExpanded === isExpanded) {
      // The height measured during an animation is not the natural one.
      if (!isAnimating) {
        lastRef.current = { isExpanded, height: currentHeight };
      }

      return;
    }

    // Continue from the visible height if the previous animation was running.
    const from = isAnimating ? currentHeight : last.height;

    animation?.cancel();

    const height = element.getBoundingClientRect().height;

    lastRef.current = { isExpanded, height };

    if (prefersReducedMotion || !element.animate || from === height) return;

    animationRef.current = element.animate(
      {
        blockSize: [`${from}px`, `${height}px`],
        // Hides the content that does not fit yet, without a scroll container.
        overflow: ['clip', 'clip'],
      },
      {
        // The Web Animations API throws on negative and non-finite durations.
        duration:
          Number.isFinite(duration) && duration >= 0
            ? duration
            : DEFAULT_DURATION,
        easing: 'ease-in-out',
      }
    );
  });

  return animationRef;
}
