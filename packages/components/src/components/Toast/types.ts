import type { CSSProperties, ReactElement } from 'react';

export const toastPropStatus = ['info', 'warning', 'error', 'success'] as const;

export type ToastPropStatus = (typeof toastPropStatus)[number];

export const toastPlacement = [
  'bottom',
  'bottom-start',
  'bottom-end',
  'top',
  'top-start',
  'top-end',
] as const;

export type ToastPlacement = (typeof toastPlacement)[number];

export type ToastProviderProps = {
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** The maximum number of toasts to display at a time. */
  maxVisibleToasts?: number;
  /** Where to show the toast stack on the screen. */
  placement?: ToastPlacement;
};

export type ToastProviderComponent = (
  props: ToastProviderProps
) => ReactElement | null;
