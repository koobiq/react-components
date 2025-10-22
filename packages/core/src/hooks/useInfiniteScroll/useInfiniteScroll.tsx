import { useEffect, useRef, useCallback } from 'react';

type UseInfiniteScrollOptions = {
  fetchData?: () => void | Promise<void>;
  hasMore?: boolean;
  isEnabled?: boolean;
};

export const useInfiniteScroll = ({
  fetchData,
  hasMore,
  isEnabled = true,
}: UseInfiniteScrollOptions) => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);

  const handleIntersection = useCallback(
    async (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (!entry?.isIntersecting) return;
      if (!isEnabled || !hasMore) return;
      // prevent duplicate calls while a fetch is in progress
      if (isFetchingRef.current) return;

      try {
        isFetchingRef.current = true;
        await fetchData?.();
      } finally {
        isFetchingRef.current = false;
      }
    },
    [fetchData, hasMore, isEnabled]
  );

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      typeof IntersectionObserver === 'undefined'
    ) {
      return undefined;
    }

    if (!isEnabled) return undefined;

    const observer = new IntersectionObserver(handleIntersection);
    const el = loadMoreRef.current;

    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, [handleIntersection, isEnabled]);

  return { loadMoreRef };
};
