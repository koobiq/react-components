import { type ReactNode, useRef } from 'react';

import { useSsr } from '@koobiq/react-core';
import {
  type AriaToastRegionProps,
  type ToastState,
  useToastRegion,
  // eslint-disable-next-line camelcase
  useUNSAFE_PortalContext,
} from '@koobiq/react-primitives';
import { createPortal } from 'react-dom';

import { Toast } from '../Toast';

import s from './ToastRegion.module.css';

export type ToastRegionProps<T> = AriaToastRegionProps & {
  state: ToastState<T>;
};

export function ToastRegion<T extends ReactNode>({
  state,
  ...props
}: ToastRegionProps<T>) {
  const { isBrowser } = useSsr();
  const ref = useRef(null);
  const { regionProps } = useToastRegion(props, state, ref);
  const { getContainer } = useUNSAFE_PortalContext();
  let portalContainer;

  if (isBrowser) {
    portalContainer = document.body;

    if (getContainer) {
      portalContainer = getContainer();
    }
  }

  return state.visibleToasts.length > 0 && portalContainer
    ? createPortal(
        <div {...regionProps} ref={ref} className={s.toastRegion}>
          {state.visibleToasts.map((toast) => (
            <Toast key={toast.key} toast={toast} state={state} />
          ))}
        </div>,
        portalContainer
      )
    : null;
}
