import type { Ref } from 'react';

import type {
  ToastState,
  QueuedToast,
  AriaToastProps,
} from '@koobiq/react-primitives';

export const toastPropStatus = ['info', 'warning', 'error', 'success'] as const;

export type ToastPropStatus = (typeof toastPropStatus)[number];

export type MyToast = {
  title?: string;
  description?: string;
  status?: ToastPropStatus;
};

export type ToastProps<T> = AriaToastProps<T> & {
  state: ToastState<T>;
  'data-transition'?: string;
  toast: QueuedToast<MyToast>;
  innerRef: Ref<HTMLDivElement>;
};
