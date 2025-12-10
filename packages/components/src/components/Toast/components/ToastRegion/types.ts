import type { ReactElement, Ref } from 'react';

import type {
  AriaToastRegionProps,
  ToastState,
} from '@koobiq/react-primitives';

import type { ToastPlacement } from '../../types';
import type { ToastContentProps } from '../Toast';

export type ToastRegionProps = AriaToastRegionProps & {
  ref?: Ref<HTMLDivElement>;
  state: ToastState<ToastContentProps>;
  placement?: ToastPlacement;
};

export type ToastRegionComponent = (
  props: ToastRegionProps
) => ReactElement | null;
