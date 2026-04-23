'use client';

import { useResizeObserver } from '../useResizeObserver';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
/**
 * A hook listens for size changes of the particular element and returns its
 * width and height.
 */
export function useElementSize<T extends HTMLElement = any>(
  options?: ResizeObserverOptions
) {
  const [ref, { width, height }] = useResizeObserver<T>(options);

  return { ref, width, height };
}
