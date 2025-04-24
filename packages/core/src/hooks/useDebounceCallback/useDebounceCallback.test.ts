import { renderHook } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

import { useDebounceCallback } from './index';

describe('useDebounceCallback', () => {
  const callback = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    callback.mockRestore();
    vi.useRealTimers();
  });

  describe('core logic', () => {
    it('should correctly delay the function call', async () => {
      const { result } = renderHook(() =>
        useDebounceCallback({ callback, delay: 300 })
      );

      const [debouncedCallback] = result.current;

      debouncedCallback();
      expect(callback).not.toBeCalled();

      vi.advanceTimersByTime(250);

      debouncedCallback();
      expect(callback).not.toBeCalled();

      vi.runAllTimers();
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should cancel the function call when cancel is invoked', async () => {
      const { result } = renderHook(() =>
        useDebounceCallback({ callback, delay: 300 })
      );

      const [debouncedCallback, cancel] = result.current;

      debouncedCallback();
      cancel();

      vi.runAllTimers();

      expect(callback).toHaveBeenCalledTimes(0);
    });

    it('should cancel the function call on unmount', async () => {
      const { result, unmount } = renderHook(() =>
        useDebounceCallback({ callback, delay: 300 })
      );

      const [debouncedCallback] = result.current;

      debouncedCallback();
      unmount();

      vi.runAllTimers();

      expect(callback).toHaveBeenCalledTimes(0);
    });

    it('should reset the timeout when callback changes', async () => {
      const newCallback = vi.fn();

      const { result, rerender } = renderHook(
        (cb: (args?: unknown) => void, delay = 300) =>
          useDebounceCallback({ callback: cb || callback, delay })
      );

      const [debouncedCallbackOne] = result.current;
      debouncedCallbackOne();
      expect(callback).not.toBeCalled();

      rerender(newCallback);
      const [debouncedCallbackTwo] = result.current;
      debouncedCallbackTwo();

      vi.runAllTimers();

      expect(callback).toHaveBeenCalledTimes(0);
      expect(newCallback).toHaveBeenCalledTimes(1);
    });

    it('should use default delay if not provided', async () => {
      const { result } = renderHook(() => useDebounceCallback({ callback }));
      const [debouncedCallback] = result.current;

      debouncedCallback();

      vi.runAllTimers();

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should correctly pass arguments to the callback', async () => {
      let mutableValue = false;

      const callback = vi.fn((arg: boolean) => {
        mutableValue = arg;

        return mutableValue;
      });

      const { result } = renderHook(() => useDebounceCallback({ callback }));

      const [debouncedCallback] = result.current;

      debouncedCallback(true);

      vi.runAllTimers();

      expect(callback).toHaveBeenCalledTimes(1);
      expect(mutableValue).toBe(true);
    });
  });

  describe('check options prop', () => {
    it('should call the first callback immediately when firstCallWithoutDelay is true', () => {
      const { result } = renderHook(() =>
        useDebounceCallback({
          callback,
          delay: 300,
          options: { firstCallWithoutDelay: true },
        })
      );

      const [debouncedCallback] = result.current;

      debouncedCallback();
      expect(callback).toHaveBeenCalledTimes(1);

      vi.runAllTimers();

      debouncedCallback();
      expect(callback).toHaveBeenCalledTimes(2);

      debouncedCallback();
      expect(callback).toHaveBeenCalledTimes(2);

      vi.runAllTimers();

      expect(callback).toHaveBeenCalledTimes(3);
    });
  });
});
