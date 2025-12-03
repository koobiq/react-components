import type { Ref } from 'react';

import type {
  ToastState,
  QueuedToast,
  AriaToastProps,
} from '@koobiq/react-primitives';

import type { ToastProps as ToastBaseProps } from '../../index';

export type ToastProps = AriaToastProps<ToastBaseProps> & {
  state: ToastState<ToastBaseProps>;
  'data-transition'?: string;
  toast: QueuedToast<ToastBaseProps>;
  innerRef: Ref<HTMLDivElement>;
};
