import { useEffect, useRef, useCallback } from 'react';

export const useInfiniteScroll = (fetchData: () => void, hasMore: boolean) => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const isIntersecting = entries[0]?.isIntersecting;

      if (isIntersecting && hasMore) {
        fetchData();
      }
    },
    [fetchData, hasMore]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection);

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [handleIntersection]);

  return { loadMoreRef };
};
