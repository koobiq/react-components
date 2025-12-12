import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ToastQueue, DELAY } from './KbqToastQueue';

describe('ToastQueue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should close toasts FIFO, while TTLs tick in parallel and delay the next close', () => {
    const q = new ToastQueue<string>();

    const onClose1 = vi.fn();
    const onClose2 = vi.fn();
    const onClose3 = vi.fn();

    // Add in order: 1 (5s), 2 (10s), 3 (5s)
    const k1 = q.add('t1', { timeout: 5000, onClose: onClose1 });
    const k2 = q.add('t2', { timeout: 10000, onClose: onClose2 });
    const k3 = q.add('t3', { timeout: 5000, onClose: onClose3 });

    expect(typeof k1).toBe('string');
    expect(typeof k2).toBe('string');
    expect(typeof k3).toBe('string');

    // Before 5s: nobody closes
    vi.advanceTimersByTime(4999);
    expect(onClose1).toHaveBeenCalledTimes(0);
    expect(onClose2).toHaveBeenCalledTimes(0);
    expect(onClose3).toHaveBeenCalledTimes(0);

    // At exactly 5s: only the oldest timed toast (t1) can close
    vi.advanceTimersByTime(1);
    expect(onClose1).toHaveBeenCalledTimes(1);
    expect(onClose2).toHaveBeenCalledTimes(0);
    expect(onClose3).toHaveBeenCalledTimes(0);

    // Gap (2s) after a close: no closes during the delay window
    vi.advanceTimersByTime(DELAY - 1);
    expect(onClose2).toHaveBeenCalledTimes(0);
    expect(onClose3).toHaveBeenCalledTimes(0);

    vi.advanceTimersByTime(1);
    // After the delay ends: t2 is not expired yet (it has ~5s left), so still no close
    expect(onClose2).toHaveBeenCalledTimes(0);
    expect(onClose3).toHaveBeenCalledTimes(0);

    // At 10s total: t2 expires and closes
    vi.advanceTimersByTime(3000); // was 7s -> becomes 10s
    expect(onClose2).toHaveBeenCalledTimes(1);
    expect(onClose3).toHaveBeenCalledTimes(0);

    // t3 expired at 5s, but must wait for the delay after t2 closes
    vi.advanceTimersByTime(DELAY - 1);
    expect(onClose3).toHaveBeenCalledTimes(0);

    vi.advanceTimersByTime(1);
    expect(onClose3).toHaveBeenCalledTimes(1);
  });

  it('should start the delay after manual close before the next auto-close', () => {
    const q = new ToastQueue<string>();

    const onClose1 = vi.fn();
    const onClose2 = vi.fn();

    const k1 = q.add('t1', { timeout: 5000, onClose: onClose1 });
    q.add('t2', { timeout: 5000, onClose: onClose2 });

    vi.advanceTimersByTime(3000);

    // Manually close t1 at 3s -> delay blocks auto-close until 5s
    q.close(k1);
    expect(onClose1).toHaveBeenCalledTimes(1);
    expect(onClose2).toHaveBeenCalledTimes(0);

    // At 4s, t2 still cannot auto-close due to the delay
    vi.advanceTimersByTime(DELAY / 2);
    expect(onClose2).toHaveBeenCalledTimes(0);

    // At 5s, the delay ends and t2 is expired -> it closes
    vi.advanceTimersByTime(DELAY / 2);
    expect(onClose2).toHaveBeenCalledTimes(1);
  });

  it('should freeze auto-close on pauseAll and continue correctly on resumeAll (no huge delta)', () => {
    const q = new ToastQueue<string>();
    const onClose = vi.fn();

    q.add('t', { timeout: 5000, onClose });

    q.pauseAll();

    // Even if 20s pass, it should not close while paused
    vi.advanceTimersByTime(20000);
    expect(onClose).toHaveBeenCalledTimes(0);

    q.resumeAll();

    // After resumes, it still needs 5s of active time
    vi.advanceTimersByTime(4999);
    expect(onClose).toHaveBeenCalledTimes(0);

    vi.advanceTimersByTime(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should stop ticker when no timed toasts remain', () => {
    const q = new ToastQueue<string>();
    const onClose = vi.fn();

    q.add('t', { timeout: 5000, onClose });

    // Expire and close
    vi.advanceTimersByTime(5000);
    expect(onClose).toHaveBeenCalledTimes(1);

    // Ticker should be stopped (private, but accessible at runtime)
    expect((q as any).tickId).toBeNull();
    expect((q as any).lastTickAt).toBe(0);
    expect((q as any).nextCloseAllowedAt).toBe(0);
  });
});
