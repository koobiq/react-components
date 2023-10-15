'use client';

import { useState, useEffect } from 'react';

type MediaQueryCallback = (event: MediaQueryListEvent) => void;

function listen(query: MediaQueryList, callback: MediaQueryCallback) {
  query.addEventListener('change', callback);

  return () => query.removeEventListener('change', callback);
}

export type UseMediaQueryOptions = {
  /**
   * As `window.matchMedia()` is unavailable on the server,
   * it returns a default matches during the first mount.
   * @default false
   */
  defaultMatches: boolean[];
  /**
   * The `defaultMatches` property is what will be returned
   * on the first mount if ssr is set to `true`.
   * @default true
   */
  ssr?: boolean;
};

export function useMediaQuery(
  query: string[],
  options?: UseMediaQueryOptions
): boolean[] {
  const { defaultMatches, ssr = true } = options || {};

  const queries = Array.isArray(query) ? query : [query];

  const [value, setValue] = useState(() =>
    queries.map((query, index) => ({
      media: query,
      matches: !ssr
        ? window.matchMedia?.(query)?.matches
        : defaultMatches?.[index] || false,
    }))
  );

  useEffect(() => {
    setValue((prev) => {
      const current = queries.map((query) => ({
        media: query,
        matches: window.matchMedia(query).matches,
      }));

      return prev.every(
        (v, i) =>
          v.matches === current[i].matches && v.media === current[i].media
      )
        ? prev
        : current;
    });

    const mql = queries.map((query) => window.matchMedia(query));

    const handler = (evt: MediaQueryListEvent) => {
      setValue((prev) =>
        prev.slice().map((item) => {
          if (item.media === evt.media)
            return { ...item, matches: evt.matches };

          return item;
        })
      );
    };

    const cleanups = mql.map((mq) => listen(mq, handler));

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return value.map((item) => item.matches);
}
