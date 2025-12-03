import type { CSSProperties, ReactElement, ReactNode } from 'react';

export const toastPropStatus = ['info', 'warning', 'error', 'success'] as const;

export type ToastPropStatus = (typeof toastPropStatus)[number];

export type ToastProps = {
  title?: ReactNode;
  action?: ReactNode;
  caption?: ReactNode;
  status?: ToastPropStatus;
};

export type ToastProviderProps = {
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** The maximum number of toasts to display at a time. */
  maxVisibleToasts?: number;
};

export type ToastProviderComponent = (
  props: ToastProviderProps
) => ReactElement | null;
