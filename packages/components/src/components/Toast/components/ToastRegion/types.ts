import type { ReactElement, Ref } from 'react';

import type {
  AriaToastRegionProps,
  ToastState,
} from '@koobiq/react-primitives';

import type { ToastProps } from '../../types';

export type ToastRegionProps = AriaToastRegionProps & {
  state: ToastState<ToastProps>;
  ref?: Ref<HTMLDivElement>;
};

export type ToastRegionComponent = (
  props: ToastRegionProps
) => ReactElement | null;
