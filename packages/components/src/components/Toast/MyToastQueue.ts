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

const CHECK_INTERVAL = 500;
const DELAY = 2000;

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

  // Ticker lifecycle
  private startTicker(): void {
    if (this.tickId != null) return;
    if (typeof window === 'undefined') return;

    this.lastTickAt = Date.now();
    this.tickId = setInterval(this.onTick, CHECK_INTERVAL);
  }

  private stopTicker(): void {
    if (this.tickId == null) return;

    clearInterval(this.tickId);
    this.tickId = null;
    this.lastTickAt = 0;
  }

  private hasAnyTimedToast(): boolean {
    return this.queue.some((t) => t.ttl != null);
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

    // new toasts at the front (existing behavior)
    this.queue.unshift(toast);

    this.updateVisibleToasts('add');

    // start ticking only if a timed toast exists
    if (toast.ttl != null) {
      this.startTicker();
    }

    return toastKey;
  }

  /**
   * Manual close.
   * Also creates a gap before the next auto-close is allowed.
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
    this.updateVisibleToasts('clear');

    this.stopTicker();
    this.nextCloseAllowedAt = 0;
  }

  private updateVisibleToasts(action: ToastAction) {
    // Remove excess toasts when queue is too large
    if (this.queue.length > this.maxVisibleToasts) {
      const excess = this.queue.slice(this.maxVisibleToasts);

      for (const toast of excess) {
        toast.onClose?.();
      }

      this.queue = this.queue.slice(0, this.maxVisibleToasts);
    }

    this.visibleToasts = this.queue.slice(0, this.maxVisibleToasts);

    this.runWithWrapUpdate(() => {
      for (const fn of this.subscriptions) fn();
    }, action);

    // if timed toasts disappeared, stop ticker
    if (!this.hasAnyTimedToast()) {
      this.stopTicker();
    }
  }

  private removeToast(key: string): void {
    const index = this.queue.findIndex((t) => t.key === key);

    if (index >= 0) {
      this.queue[index].onClose?.();
      this.queue.splice(index, 1);
    }

    this.updateVisibleToasts('remove');
  }

  private getHeadTimedToast(): QueuedToast<T> | undefined {
    for (let i = this.queue.length - 1; i >= 0; i -= 1) {
      const t = this.queue[i];
      if (t.ttl != null) return t;
    }

    return undefined;
  }

  private onTick = () => {
    if (this.isPaused) return;
    if (this.queue.length === 0) return;

    // debug
    console.log('tick');

    const now = Date.now();

    // delta-based ticking (more accurate than subtracting CHECK_INTERVAL)
    const delta = this.lastTickAt
      ? Math.max(0, now - this.lastTickAt)
      : CHECK_INTERVAL;

    this.lastTickAt = now;

    // all timed toasts tick simultaneously
    for (const t of this.visibleToasts) {
      // eslint-disable-next-line no-continue
      if (t.ttl == null) continue;
      t.ttl = Math.max(0, t.ttl - delta);
    }

    // enforce gap between closes
    if (now < this.nextCloseAllowedAt) return;

    // close only the oldest timed toast, if it has expired
    const head = this.getHeadTimedToast();
    if (!head) return;

    if ((head.ttl ?? 0) > 0) return;

    this.removeToast(head.key);
    this.nextCloseAllowedAt = now + DELAY;
  };
}
