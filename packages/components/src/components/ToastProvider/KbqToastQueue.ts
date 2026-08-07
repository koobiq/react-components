type ToastAction = 'add' | 'remove' | 'clear';

export interface ToastStateProps {
  /** The maximum number of toasts to display at a time. */
  maxVisibleToasts?: number;
  /** Function to wrap updates in (i.e. document.startViewTransition()). */
  wrapUpdate?: (fn: () => void, action: ToastAction) => void;
}

export interface ToastOptions {
  /** Handler that is called when the toast is closed, either by the user or after a timeout. */
  onClose?: () => void;
  /** A timeout to automatically close the toast after, in milliseconds. */
  timeout?: number;
  /**
   * Optional id for the toast.
   * If not provided, a unique id is generated automatically,
   * but you can also pass your own id if you need to control it.
   */
  id?: string;
}

export interface QueuedToast<T> extends ToastOptions {
  /** The content of the toast. */
  content: T;
  /** A unique key for the toast. */
  key: string;
  /** Remaining ms until the toast becomes eligible for auto-close. */
  ttl?: number;
  /**
   * When the ttl ran out. Tells a late tick how long the toast has been due.
   * @internal
   */
  expiredAt?: number;
  /**
   * When the toast was queued. Keeps a tick from counting down time before that.
   * @internal
   */
  addedAt?: number;
}

export interface ToastState<T> {
  add(content: T, options?: ToastOptions): string;
  close(key: string): void;
  pauseAll(): void;
  resumeAll(): void;
  visibleToasts: QueuedToast<T>[];
}

export const CHECK_INTERVAL = 100;
export const DELAY = 2000;

export class ToastQueue<T> {
  private queue: QueuedToast<T>[] = [];

  private subscriptions: Set<() => void> = new Set();

  private maxVisibleToasts: number;

  private wrapUpdate?: (fn: () => void, action: ToastAction) => void;

  /** The currently visible toasts. */
  visibleToasts: QueuedToast<T>[] = [];

  private isPaused = false;

  /** When the current pause started. */
  private pausedAt = 0;

  private tickId: ReturnType<typeof setInterval> | null = null;

  private lastTickAt = 0;

  /** Next moment when an auto-close is allowed (gap after any close). */
  private nextCloseAllowedAt = 0;

  /** Count of timed toasts (ttl != null) currently in the queue. */
  private timedCount = 0;

  constructor(options?: ToastStateProps) {
    this.maxVisibleToasts = options?.maxVisibleToasts ?? Infinity;
    this.wrapUpdate = options?.wrapUpdate;
  }

  private runWithWrapUpdate(fn: () => void, action: ToastAction): void {
    if (this.wrapUpdate) this.wrapUpdate(fn, action);
    else fn();
  }

  /** Subscribes to updates to the visible toasts. */
  subscribe(fn: () => void): () => void {
    this.subscriptions.add(fn);

    return () => this.subscriptions.delete(fn);
  }

  /** Catches up right after the tab is back, before stale toasts are painted. */
  private onVisibilityChange = () => {
    if (document.visibilityState === 'visible') this.onTick();
  };

  /** Starts the ticker. */
  private startTicker(): void {
    if (this.tickId != null) return;
    if (typeof window === 'undefined') return;

    this.lastTickAt = Date.now();
    this.tickId = setInterval(this.onTick, CHECK_INTERVAL);
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  /** Stops the ticker. */
  private stopTicker(): void {
    if (this.tickId == null) return;

    clearInterval(this.tickId);
    this.tickId = null;
    document.removeEventListener('visibilitychange', this.onVisibilityChange);

    this.lastTickAt = 0;
    this.nextCloseAllowedAt = 0;
  }

  /** Adds a new toast to the queue. */
  add(content: T, options: ToastOptions = {}): string {
    const toastKey = options.id ?? `_${Math.random().toString(36).slice(2)}`;
    const timeout = options.timeout ?? 0;

    const toast: QueuedToast<T> = {
      ...options,
      content,
      key: toastKey,
      ttl: timeout > 0 ? timeout : undefined,
      addedAt: Date.now(),
    };

    this.queue.unshift(toast);

    if (toast.ttl != null) {
      this.timedCount += 1;
    }

    this.updateVisibleToasts('add');

    if (toast.ttl != null) {
      this.startTicker();
    }

    return toastKey;
  }

  /**
   * Manual close.
   * Also creates a delay before the next auto-close is allowed.
   */
  close(key: string): void {
    this.removeToast(key);

    // while paused the gap starts counting from the resume, not from now
    this.nextCloseAllowedAt =
      (this.isPaused ? this.pausedAt : Date.now()) + DELAY;
  }

  /** Pauses all auto-close logic (e.g. hover/focus). */
  pauseAll(): void {
    if (this.isPaused) return;

    this.isPaused = true;
    this.pausedAt = Date.now();
  }

  /** Resumes auto-close logic, moving pending slots past the pause. */
  resumeAll(): void {
    if (!this.isPaused) return;

    const now = Date.now();
    const pausedFor = Math.max(0, now - this.pausedAt);

    this.isPaused = false;
    this.pausedAt = 0;

    // addedAt stays put: the pause is already excluded by lastTickAt below
    for (const toast of this.queue) {
      if (toast.expiredAt != null) toast.expiredAt += pausedFor;
    }

    if (this.nextCloseAllowedAt > 0) this.nextCloseAllowedAt += pausedFor;

    if (this.tickId != null) {
      this.lastTickAt = now;
    }
  }

  clear(): void {
    const cleared = this.queue;

    this.queue = [];
    this.timedCount = 0;

    // detached first: a handler may queue another toast, which stays
    for (const toast of cleared) toast.onClose?.();

    // stops the ticker unless a handler queued a timed toast
    this.updateVisibleToasts('clear');
  }

  private updateVisibleToasts(action: ToastAction) {
    this.visibleToasts = this.queue.slice(0, this.maxVisibleToasts);

    this.runWithWrapUpdate(() => {
      for (const fn of this.subscriptions) fn();
    }, action);

    // if no timed toasts remain, stop ticker
    if (this.timedCount === 0) {
      this.stopTicker();
    }
  }

  /** Drops a toast from the queue without notifying subscribers. */
  private deleteToast(key: string): void {
    const index = this.queue.findIndex((t) => t.key === key);

    if (index < 0) return;

    const [toast] = this.queue.splice(index, 1);

    if (toast.ttl != null) {
      this.timedCount -= 1;
    }

    // called last: the handler may queue another toast
    toast.onClose?.();
  }

  private removeToast(key: string): void {
    this.deleteToast(key);
    this.updateVisibleToasts('remove');
  }

  /**
   * Oldest timed toast (FIFO among timed toasts).
   * We add via unshift, so the oldest is at the end.
   */
  private getHeadTimedToast(): QueuedToast<T> | undefined {
    for (let i = this.queue.length - 1; i >= 0; i -= 1) {
      const t = this.queue[i];
      if (t.ttl != null) return t;
    }

    return undefined;
  }

  /**
   * A system clock moved backwards leaves every timestamp ahead of `now`, which
   * would stall the countdown and every pending slot until wall time catches
   * up. Move them back by the same jump instead.
   */
  private rebaseOnClockJump(now: number): void {
    const jump = this.lastTickAt ? this.lastTickAt - now : 0;

    if (jump <= 0) return;

    for (const toast of this.queue) {
      if (toast.addedAt != null) toast.addedAt -= jump;
      if (toast.expiredAt != null) toast.expiredAt -= jump;
    }

    if (this.nextCloseAllowedAt > 0) this.nextCloseAllowedAt -= jump;

    this.lastTickAt = now;
  }

  /** Real time passed since the previous tick. */
  private takeElapsed(now: number): number {
    const elapsed = this.lastTickAt
      ? Math.max(0, now - this.lastTickAt)
      : CHECK_INTERVAL;

    this.lastTickAt = now;

    return elapsed;
  }

  /** Counts timed toasts down and marks the ones that ran out. */
  private countDown(now: number, elapsed: number): void {
    for (const toast of this.queue) {
      if (toast.ttl == null || toast.ttl === 0) continue;

      // a toast queued mid-tick has only lived through part of it,
      // and a system clock moved backwards must not add time back
      const step = Math.max(0, Math.min(elapsed, now - (toast.addedAt ?? now)));
      const remaining = Math.max(0, toast.ttl - step);

      // the ttl can run out inside a long tick
      if (remaining === 0) toast.expiredAt = now - (step - toast.ttl);

      toast.ttl = remaining;
    }
  }

  /**
   * Closes the oldest expired toast if its slot has come, then books the next
   * slot DELAY later. Slots follow the expiry, not the tick, so a late tick
   * still closes what it slept through.
   */
  private closeHeadIfDue(now: number): boolean {
    const head = this.getHeadTimedToast();

    if (!head || head.ttl !== 0) return false;

    const dueAt = Math.max(head.expiredAt ?? now, this.nextCloseAllowedAt);

    if (now < dueAt) return false;

    this.deleteToast(head.key);
    this.nextCloseAllowedAt = this.timedCount > 0 ? dueAt + DELAY : 0;

    return true;
  }

  /**
   * Hidden tabs get throttled ticks (~1/s, ~1/min after a while). One close per
   * tick would leave expired toasts on screen for minutes, so a tick closes
   * every slot it covers.
   */
  private onTick = () => {
    if (this.isPaused || this.queue.length === 0) return;

    const now = Date.now();

    this.rebaseOnClockJump(now);
    this.countDown(now, this.takeElapsed(now));

    let closed = 0;

    while (this.closeHeadIfDue(now)) closed += 1;

    if (closed > 0) this.updateVisibleToasts('remove');
  };
}
