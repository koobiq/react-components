'use client';

import { createRef, type RefObject, useMemo } from 'react';

import { isNumber } from '../../utils';

export type UseRefsReturn<
  T,
  Keys extends number | readonly string[],
> = Keys extends readonly string[]
  ? Record<Keys[number], RefObject<T>>
  : Array<RefObject<T>>;

export const useRefs = <T, Keys extends number | readonly string[] = number>(
  keys: Keys,
  deps: unknown[] = []
): UseRefsReturn<T, Keys> =>
  useMemo(() => {
    if (!isNumber(keys)) {
      return Object.fromEntries(
        keys.map((key) => [key, createRef()])
      ) as UseRefsReturn<T, Keys>;
    }

    return new Array(keys).fill(0).map(() => createRef<T>()) as UseRefsReturn<
      T,
      Keys
    >;
  }, [isNumber(keys) ? keys : keys.join('-'), ...deps]);
