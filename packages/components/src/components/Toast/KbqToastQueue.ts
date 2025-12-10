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
}

export interface QueuedToast<T> extends ToastOptions {
  /** The content of the toast. */
  content: T;
  /** A unique key for the toast. */
  key: string;
  /** Remaining ms until the toast becomes eligible for auto-close. */
  ttl?: number;
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

  /** Starts the ticker. */
  private startTicker(): void {
    if (this.tickId != null) return;
    if (typeof window === 'undefined') return;

    this.lastTickAt = Date.now();
    this.tickId = setInterval(this.onTick, CHECK_INTERVAL);
  }

  /** Stops the ticker. */
  private stopTicker(): void {
    if (this.tickId == null) return;

    clearInterval(this.tickId);
    this.tickId = null;

    this.lastTickAt = 0;
    this.nextCloseAllowedAt = 0;
  }

  /** Adds a new toast to the queue. */
  add(content: T, options: ToastOptions = {}): string {
    const toastKey = `_${Math.random().toString(36).slice(2)}`;
    const timeout = options.timeout ?? 0;

    const toast: QueuedToast<T> = {
      ...options,
      content,
      key: toastKey,
      ttl: timeout > 0 ? timeout : undefined,
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
    this.nextCloseAllowedAt = Date.now() + DELAY;
  }

  /** Pauses all auto-close logic (e.g. hover/focus). */
  pauseAll(): void {
    this.isPaused = true;
  }

  /** Resumes auto-close logic. */
  resumeAll(): void {
    if (!this.isPaused) return;

    this.isPaused = false;

    if (this.tickId != null) {
      this.lastTickAt = Date.now();
    }
  }

  clear(): void {
    for (const toast of this.queue) toast.onClose?.();

    this.queue = [];
    this.timedCount = 0;

    this.updateVisibleToasts('clear');
    this.stopTicker();
  }

  private updateVisibleToasts(action: ToastAction) {
    // Remove excess toasts when queue is too large
    if (this.queue.length > this.maxVisibleToasts) {
      const excess = this.queue.splice(this.maxVisibleToasts);

      for (const toast of excess) {
        if (toast.ttl != null) this.timedCount -= 1;
        toast.onClose?.();
      }
    }

    this.visibleToasts = this.queue.slice(0, this.maxVisibleToasts);

    this.runWithWrapUpdate(() => {
      for (const fn of this.subscriptions) fn();
    }, action);

    // if no timed toasts remain, stop ticker
    if (this.timedCount === 0) {
      this.stopTicker();
    }
  }

  private removeToast(key: string): void {
    const index = this.queue.findIndex((t) => t.key === key);

    if (index >= 0) {
      const toast = this.queue[index];

      if (toast.ttl != null) {
        this.timedCount -= 1;
      }

      toast.onClose?.();
      this.queue.splice(index, 1);
    }

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

  private onTick = () => {
    if (this.isPaused || this.queue.length === 0) return;

    const now = Date.now();

    const delta = this.lastTickAt
      ? Math.max(0, now - this.lastTickAt)
      : CHECK_INTERVAL;

    this.lastTickAt = now;

    // all timed toasts tick simultaneously
    for (const t of this.queue) {
      if (t.ttl != null) {
        t.ttl = Math.max(0, t.ttl - delta);
      }
    }

    // enforce delay between closes
    if (now < this.nextCloseAllowedAt) return;

    // close only the head timed toast, if it has expired
    const head = this.getHeadTimedToast();
    if (!head || (head.ttl ?? 0) > 0) return;

    this.removeToast(head.key);
    this.nextCloseAllowedAt = this.timedCount > 0 ? now + DELAY : 0;
  };
}
