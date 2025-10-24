'use client';

import { useEffect, useRef, useCallback } from 'react';

type UseInfiniteScrollOptions = {
  /** Data loader called when the sentinel becomes visible. */
  fetchData?: () => void | Promise<void>;
  /** Whether more data is available. */
  hasMore?: boolean;
  /** Root element for the observer (default: viewport). */
  root?: Element | Document | null;
  /** Enables or disables the observer. */
  isEnabled?: boolean;
  /** Margin around the root to trigger loading earlier. */
  rootMargin?: string;
  /** Visibility threshold(s) to trigger intersection. */
  threshold?: number | number[];
};

export function useInfiniteScroll<T extends HTMLElement = any>({
  fetchData,
  hasMore,
  rootMargin,
  threshold,
  root,
  isEnabled = true,
}: UseInfiniteScrollOptions) {
  const loadMoreRef = useRef<T>(null);
  const isFetchingRef = useRef(false);
  const savedFetchData = useRef<typeof fetchData>();

  useEffect(() => {
    savedFetchData.current = fetchData;
  }, [fetchData]);

  const handleIntersection = useCallback(
    async (entries: IntersectionObserverEntry[]) => {
      if (!isEnabled || !hasMore) return;

      const [entry] = entries;

      const { isIntersecting } = entry;
      if (!isIntersecting) return;

      // prevent duplicate calls while a fetch is in progress
      if (isFetchingRef.current) return;

      try {
        isFetchingRef.current = true;

        await savedFetchData?.current?.();
      } finally {
        isFetchingRef.current = false;
      }
    },
    [hasMore, isEnabled]
  );

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      typeof IntersectionObserver === 'undefined'
    ) {
      return undefined;
    }

    if (!isEnabled) return undefined;

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin,
      threshold,
      root,
    });

    const el = loadMoreRef.current;

    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, [
    handleIntersection,
    isEnabled,
    rootMargin,
    JSON.stringify(threshold),
    root,
  ]);

  return { loadMoreRef };
}
