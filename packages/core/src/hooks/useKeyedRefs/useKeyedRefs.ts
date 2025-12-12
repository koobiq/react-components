'use client';

import { createRef, type RefObject, type Key, useRef } from 'react';

export function useKeyedRefs<T>() {
  const mapRef = useRef(new Map<Key, RefObject<T>>());

  return (key: Key): RefObject<T> => {
    let ref = mapRef.current.get(key);

    if (!ref) {
      ref = createRef<T>();
      mapRef.current.set(key, ref);
    }

    return ref;
  };
}
