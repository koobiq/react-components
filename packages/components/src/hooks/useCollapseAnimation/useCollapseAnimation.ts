'use client';

import { useRef, type RefObject } from 'react';

import { useIsomorphicEffect, useMediaQuery } from '@koobiq/react-core';

const DEFAULT_DURATION = 100;

/**
 * Smoothly animates the block size of an element when `isExpanded` changes.
 * The new content is already rendered when the animation starts, so it only
 * animates the box between the heights before and after the change.
 */
export function useCollapseAnimation(
  ref: RefObject<HTMLElement | null>,
  isExpanded: boolean,
  duration = DEFAULT_DURATION
) {
  const lastRef = useRef<{ isExpanded: boolean; height: number }>(undefined);

  const [prefersReducedMotion] = useMediaQuery([
    '(prefers-reduced-motion: reduce)',
  ]);

  // Runs after every commit to keep the last natural height up to date.
  useIsomorphicEffect(() => {
    const element = ref.current;

    if (!element) return;

    const last = lastRef.current;
    const animations = element.getAnimations?.() ?? [];
    const currentHeight = element.getBoundingClientRect().height;

    if (!last || last.isExpanded === isExpanded) {
      // The height measured during an animation is not the natural one.
      if (!animations.length) {
        lastRef.current = { isExpanded, height: currentHeight };
      }

      return;
    }

    // Continue from the visible height if the previous animation was running.
    const from = animations.length ? currentHeight : last.height;

    animations.forEach((animation) => animation.cancel());

    const height = element.getBoundingClientRect().height;

    lastRef.current = { isExpanded, height };

    if (prefersReducedMotion || !element.animate || from === height) return;

    element.animate(
      {
        blockSize: [`${from}px`, `${height}px`],
        // Hides the content that does not fit yet, without a scroll container.
        overflow: ['clip', 'clip'],
      },
      { duration, easing: 'ease-in-out' }
    );
  });
}
