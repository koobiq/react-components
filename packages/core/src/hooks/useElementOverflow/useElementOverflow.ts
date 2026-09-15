'use client';

import { useResizeObserver } from '../useResizeObserver';

/** Detects whether an element's content overflows its visible bounds. */
export function useElementOverflow<T extends HTMLElement = HTMLElement>() {
  const [ref] = useResizeObserver<T>();
  const element = ref.current;

  const isOverflowX = Boolean(
    element && element.scrollWidth > element.clientWidth
  );

  const isOverflowY = Boolean(
    element && element.scrollHeight > element.clientHeight
  );

  const isOverflow = isOverflowX || isOverflowY;

  return { ref, isOverflow, isOverflowX, isOverflowY };
}
