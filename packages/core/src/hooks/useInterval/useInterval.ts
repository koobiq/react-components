'use client';

import { useEffect } from 'react';

import { useMutableRef } from '../useMutableRef';

export function useInterval(
  /** A callback function that will be triggered at a given interval. */
  callback: () => void,
  /** Time interval in milliseconds. */
  interval: number | null
): void {
  const savedCallback = useMutableRef(callback);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    if (interval || interval === 0) {
      intervalId = setInterval(() => savedCallback.current(), interval);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [interval]);
}
