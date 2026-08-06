import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ToastQueue, DELAY, CHECK_INTERVAL } from './KbqToastQueue';

describe('ToastQueue', () => {
  let queues: ToastQueue<string>[];

  const createQueue = () => {
    const queue = new ToastQueue<string>();

    queues.push(queue);

    return queue;
  };

  beforeEach(() => {
    queues = [];
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    queues.forEach((queue) => queue.clear());
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should close toasts FIFO, while TTLs tick in parallel and delay the next close', () => {
    const q = createQueue();

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
    const q = createQueue();

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
    const q = createQueue();
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

  /** Throttled background tab: the clock moves on, the ticker gets one tick. */
  const starveTicker = (ms: number) => {
    vi.spyOn(Date, 'now').mockReturnValue(Date.now() + ms);
    vi.advanceTimersByTime(CHECK_INTERVAL);
  };

  it('should catch up on a delayed tick (throttled background tab)', () => {
    const q = createQueue();
    const onClose = Array.from({ length: 5 }, () => vi.fn());

    onClose.forEach((fn, i) => q.add(`t${i}`, { timeout: 5000, onClose: fn }));

    // 30s covers the 5s ttl and all four 2s gaps
    starveTicker(30000);

    onClose.forEach((fn) => expect(fn).toHaveBeenCalledTimes(1));
    expect(q.visibleToasts).toHaveLength(0);
  });

  it('should close no more than the delayed tick is owed', () => {
    const q = createQueue();
    const onClose = Array.from({ length: 5 }, () => vi.fn());

    onClose.forEach((fn, i) => q.add(`t${i}`, { timeout: 5000, onClose: fn }));

    // due 3s ago: two slots have passed, the third is still 1s away
    starveTicker(8000);

    expect(q.visibleToasts).toHaveLength(3);
  });

  it('should count a delayed tick down from when each toast was added', () => {
    const q = createQueue();

    for (let i = 0; i < 5; i += 1) q.add(`first ${i}`, { timeout: 5000 });

    // a second burst arrives while the ticker is still starved
    vi.spyOn(Date, 'now').mockReturnValue(Date.now() + 20000);
    for (let i = 0; i < 5; i += 1) q.add(`second ${i}`, { timeout: 5000 });

    // at 30s: the first burst is due since 5s (5 slots), the second since 25s (3)
    vi.spyOn(Date, 'now').mockReturnValue(Date.now() + 10000);
    vi.advanceTimersByTime(CHECK_INTERVAL);

    expect(q.visibleToasts).toHaveLength(2);
  });

  it('should not count a toast down for time before it was added', () => {
    const q = createQueue();

    // queued 2s before a tick that covers 30s, so it keeps 3s of its ttl
    vi.spyOn(Date, 'now').mockReturnValue(Date.now() + 28000);
    q.add('late', { timeout: 5000 });

    vi.spyOn(Date, 'now').mockReturnValue(Date.now() + 2000);
    vi.advanceTimersByTime(CHECK_INTERVAL);

    expect(q.visibleToasts).toHaveLength(1);
    expect(q.visibleToasts[0].ttl).toBe(3000);
  });

  it('should catch up as soon as the tab becomes visible', () => {
    const q = createQueue();
    const onClose = Array.from({ length: 5 }, () => vi.fn());

    onClose.forEach((fn, i) => q.add(`t${i}`, { timeout: 5000, onClose: fn }));

    // hidden long enough for every toast to expire, no tick yet
    vi.spyOn(Date, 'now').mockReturnValue(Date.now() + 30000);
    document.dispatchEvent(new Event('visibilitychange'));

    expect(q.visibleToasts).toHaveLength(0);
  });

  it('should keep the gap between closes across a pause', () => {
    const q = createQueue();
    const onClose = Array.from({ length: 3 }, () => vi.fn());

    onClose.forEach((fn, i) => q.add(`t${i}`, { timeout: 5000, onClose: fn }));

    // the first one closes, the rest are waiting for their slots
    vi.advanceTimersByTime(5000);
    expect(onClose[0]).toHaveBeenCalledTimes(1);

    // hovering the region for a minute must not dump the rest at once
    q.pauseAll();
    vi.advanceTimersByTime(60000);
    q.resumeAll();

    expect(onClose[1]).toHaveBeenCalledTimes(0);

    vi.advanceTimersByTime(DELAY - 1);
    expect(onClose[1]).toHaveBeenCalledTimes(0);

    vi.advanceTimersByTime(1);
    expect(onClose[1]).toHaveBeenCalledTimes(1);
    expect(onClose[2]).toHaveBeenCalledTimes(0);

    vi.advanceTimersByTime(DELAY);
    expect(onClose[2]).toHaveBeenCalledTimes(1);
  });

  it('should not grow the ttl when the system clock moves backwards', () => {
    const q = createQueue();

    q.add('t', { timeout: 5000 });

    // NTP correction, manual clock change, waking from sleep
    vi.spyOn(Date, 'now').mockReturnValue(Date.now() - 10000);
    vi.advanceTimersByTime(CHECK_INTERVAL);

    expect(q.visibleToasts[0].ttl).toBe(5000);
  });

  it('should give a toast added while paused its full ttl after the resume', () => {
    const q = createQueue();
    const onClose = vi.fn();

    vi.advanceTimersByTime(1000);
    q.pauseAll();

    vi.advanceTimersByTime(10000);
    q.add('t', { timeout: 5000, onClose });

    vi.advanceTimersByTime(10000);
    q.resumeAll();

    vi.advanceTimersByTime(4999);
    expect(onClose).toHaveBeenCalledTimes(0);

    vi.advanceTimersByTime(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should start the delay from the resume for a close made while paused', () => {
    const q = createQueue();
    const onClose1 = vi.fn();
    const onClose2 = vi.fn();

    const k1 = q.add('t1', { timeout: 5000, onClose: onClose1 });

    q.add('t2', { timeout: 5000, onClose: onClose2 });

    // hovered, then closed by hand halfway through the pause
    q.pauseAll();
    vi.advanceTimersByTime(10000);
    q.close(k1);
    vi.advanceTimersByTime(10000);
    q.resumeAll();

    // t2 still needs its 5s, and the manual close must not add the pause on top
    vi.advanceTimersByTime(4999);
    expect(onClose2).toHaveBeenCalledTimes(0);

    vi.advanceTimersByTime(1);
    expect(onClose2).toHaveBeenCalledTimes(1);
  });

  it('should survive a toast queued from an onClose handler', () => {
    const q = createQueue();

    // the handler runs while the queue is being drained
    const onClose = vi.fn(() => {
      q.add('from onClose');
    });

    q.add('t', { timeout: 5000, onClose });

    vi.advanceTimersByTime(5000);

    expect(onClose).toHaveBeenCalledTimes(1);

    expect(q.visibleToasts.map(({ content }) => content)).toEqual([
      'from onClose',
    ]);

    expect((q as any).timedCount).toBe(0);
    expect((q as any).tickId).toBeNull();
  });

  it('should stop ticker when no timed toasts remain', () => {
    const q = createQueue();
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
