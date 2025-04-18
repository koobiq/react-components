'use client';

import { useMediaQuery } from '@koobiq/react-core';
import type { UseMediaQueryOptions } from '@koobiq/react-core';

import type { Breakpoints } from '../types';

export function useBreakpoints(
  breakpoints: Breakpoints,
  options?: UseMediaQueryOptions
) {
  const queries = Object.values(breakpoints).map(
    (width) => `(min-width: ${width}px)`
  );

  const matches = useMediaQuery(queries, options);

  return Object.keys(breakpoints).reduce(
    (acc, item, index) => ({ ...acc, [item]: matches[index] }),
    {}
  );
}
