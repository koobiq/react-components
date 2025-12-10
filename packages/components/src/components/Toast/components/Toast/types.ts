import type { CSSProperties, Ref } from 'react';

import type { DataAttributeProps } from '@koobiq/react-core';
import type {
  ToastState,
  QueuedToast,
  AriaToastProps,
} from '@koobiq/react-primitives';

import type { ToastProps as ToastBaseProps } from '../../index';

export type ToastProps = AriaToastProps<ToastBaseProps> & {
  state: ToastState<ToastBaseProps>;
  toast: QueuedToast<ToastBaseProps>;
  innerRef: Ref<HTMLDivElement>;
  style?: CSSProperties;
} & DataAttributeProps;
