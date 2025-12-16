'use client';

import { createRef, useCallback, useRef } from 'react';
import type { Key, RefObject } from 'react';

export function useKeyedRefs<T extends HTMLElement = HTMLElement>() {
  const mapRef = useRef<Map<Key, RefObject<T | null>>>(new Map());

  return useCallback((key: Key): RefObject<T | null> => {
    let ref = mapRef.current.get(key);

    if (!ref) {
      ref = createRef<T | null>();
      mapRef.current.set(key, ref);
    }

    return ref;
  }, []);
}
