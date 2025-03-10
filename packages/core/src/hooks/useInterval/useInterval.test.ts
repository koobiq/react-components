import { renderHook } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

import { useInterval } from './index';

const mockSetInterval = () => {
  vi.spyOn(global, 'setInterval');
};

const mockClearInterval = () => {
  vi.spyOn(global, 'clearInterval');
};

describe('useInterval', () => {
  const callback = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    callback.mockRestore();
  });

  it('should call a callback when the timeout is reached', () => {
    const timeout = 500;

    renderHook(() => useInterval(callback, timeout));
    vi.advanceTimersByTime(timeout);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should not call a callback if the timeout has not been reached', async () => {
    const timeout = 500;
    const earlyTimeout = 400;

    renderHook(() => useInterval(callback, timeout));
    vi.advanceTimersByTime(earlyTimeout);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should call the setInterval', () => {
    const timeout = 1200;

    mockSetInterval();
    renderHook(() => useInterval(callback, timeout));
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenCalledWith(expect.any(Function), timeout);
  });

  it('should call the clearInterval when unmounting', () => {
    mockClearInterval();
    const { unmount } = renderHook(() => useInterval(callback, 1200));
    unmount();
    expect(clearInterval).toHaveBeenCalledTimes(1);
  });

  it('should call clearInterval when interval=null', () => {
    mockClearInterval();

    const { rerender } = renderHook((timeout: number | null = 1200) =>
      useInterval(callback, timeout)
    );

    rerender(null);

    expect(clearInterval).toHaveBeenCalledTimes(1);
  });
});
