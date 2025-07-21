'use client';

import { useCallback, useEffect, useRef } from 'react';

type FunctionCallback = (...args: any[]) => void;

export type UseDebounceCallbackReturnValue<CB extends FunctionCallback> = [
  CB,
  () => void,
];

export type UseDebounceCallbackPropOptions = {
  /**
   * If `true`, the first call runs without delay.
   * @default false
   */
  firstCallWithoutDelay: boolean;
};

export type UseDebounceCallbackProps<CB> = {
  /**
   * The function to be debounced.
   * It will only run after the specified delay has passed without new calls.
   */
  callback: CB;
  /**
   * Delay in milliseconds to wait before calling the callback.
   * @default 300
   */
  delay?: number;
  /** Additional debounce options. */
  options?: UseDebounceCallbackPropOptions;
};

/** A hook that waits some time before running a function. */
export function useDebounceCallback<CB extends FunctionCallback>({
  callback,
  delay = 300,
  options = { firstCallWithoutDelay: false },
}: UseDebounceCallbackProps<CB>): UseDebounceCallbackReturnValue<CB> {
  const { firstCallWithoutDelay } = options;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedHandler = useCallback(
    (...args: any[]) => {
      if (!timeoutRef.current && firstCallWithoutDelay) {
        callback(...args);

        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
        }, delay);

        return;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
        timeoutRef.current = null;
      }, delay);
    },
    [callback, delay, options.firstCallWithoutDelay]
  ) as CB;

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  useEffect(() => () => cancel(), []);

  return [debouncedHandler, cancel];
}
