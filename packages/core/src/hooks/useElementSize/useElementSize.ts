'use client';

import { useResizeObserver } from '../useResizeObserver';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useElementSize<T extends HTMLElement = any>(
  options?: ResizeObserverOptions
) {
  const [ref, { width, height }] = useResizeObserver<T>(options);

  return { ref, width, height };
}
