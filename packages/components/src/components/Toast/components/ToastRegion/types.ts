import type { ReactElement, Ref } from 'react';

import type {
  AriaToastRegionProps,
  ToastState,
} from '@koobiq/react-primitives';

import type { ToastPlacement, ToastProps } from '../../types';

export type ToastRegionProps = AriaToastRegionProps & {
  ref?: Ref<HTMLDivElement>;
  state: ToastState<ToastProps>;
  placement?: ToastPlacement;
};

export type ToastRegionComponent = (
  props: ToastRegionProps
) => ReactElement | null;
