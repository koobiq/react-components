'use client';

import { useEffect } from 'react';

import { useMutableRef } from '../useMutableRef';

export function useTimeout(callback: () => void, delay: number | null): void {
  const savedCallback = useMutableRef(callback);

  useEffect(() => {
    if (delay == null) return undefined;

    const id = setTimeout(() => {
      savedCallback.current();
    }, delay);

    return () => clearTimeout(id);
  }, [delay]);
}
