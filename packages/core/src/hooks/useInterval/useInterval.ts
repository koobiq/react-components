'use client';

import { useEffect } from 'react';

import { useMutableRef } from '../useMutableRef';

/**
 * Custom hook that creates an interval that invokes a callback function at a
 * specified delay using the [setInterval
 * API](https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval).
 */
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
