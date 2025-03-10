'use client';

import { useRef } from 'react';

export function useMutableRef<T>(value: T) {
  const ref = useRef(value);

  ref.current = value;

  return ref;
}
