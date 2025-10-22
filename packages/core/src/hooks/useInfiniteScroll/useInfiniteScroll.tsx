import { useEffect, useRef, useCallback } from 'react';

type UseInfiniteScrollOptions = {
  fetchData?: () => void;
  hasMore?: boolean;
  isEnabled?: boolean;
};

export const useInfiniteScroll = ({
  fetchData,
  hasMore,
  isEnabled = true,
}: UseInfiniteScrollOptions) => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const isIntersecting = entries[0]?.isIntersecting;

      if (isEnabled && hasMore && isIntersecting) {
        fetchData?.();
      }
    },
    [fetchData, hasMore, isEnabled]
  );

  useEffect(() => {
    if (!isEnabled) return undefined;

    const observer = new IntersectionObserver(handleIntersection);
    const el = loadMoreRef.current;

    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, [handleIntersection, isEnabled]);

  return { loadMoreRef };
};
