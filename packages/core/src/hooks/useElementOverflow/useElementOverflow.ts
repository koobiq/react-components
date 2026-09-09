'use client';

import { useState } from 'react';

import { useIsomorphicEffect } from '../useIsomorphicEffect';
import { useResizeObserver } from '../useResizeObserver';

/** Detects whether an element's content overflows its visible bounds. */
export function useElementOverflow<T extends HTMLElement = HTMLElement>() {
  const [ref] = useResizeObserver<T>();

  const [overflow, setOverflow] = useState({
    isOverflowX: false,
    isOverflowY: false,
  });

  // Measure after every commit: content can change without resizing the box.
  useIsomorphicEffect(() => {
    const element = ref.current;

    const isOverflowX = Boolean(
      element && element.scrollWidth > element.clientWidth
    );

    const isOverflowY = Boolean(
      element && element.scrollHeight > element.clientHeight
    );

    setOverflow((previous) =>
      previous.isOverflowX === isOverflowX &&
      previous.isOverflowY === isOverflowY
        ? previous
        : { isOverflowX, isOverflowY }
    );
  });

  const { isOverflowX, isOverflowY } = overflow;
  const isOverflow = isOverflowX || isOverflowY;

  return { ref, isOverflow, isOverflowX, isOverflowY };
}
