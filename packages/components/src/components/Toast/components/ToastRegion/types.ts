import type { ReactElement, Ref } from 'react';

import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';
import type {
  AriaToastRegionProps,
  ToastState,
} from '@koobiq/react-primitives';

import type { ToastPlacement } from '../../types';
import type { ToastContentProps } from '../Toast';

export type ToastRegionProps = ExtendableComponentPropsWithRef<
  AriaToastRegionProps & {
    ref?: Ref<HTMLDivElement>;
    state: ToastState<ToastContentProps>;
    placement?: ToastPlacement;
  },
  'div'
>;

export type ToastRegionComponent = (
  props: ToastRegionProps
) => ReactElement | null;
