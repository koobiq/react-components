import { type ReactNode, useRef } from 'react';

import { useSsr } from '@koobiq/react-core';
import {
  useToastState,
  useToastRegion,
  useToast,
  useUNSAFE_PortalContext,
} from '@koobiq/react-primitives';
import type {
  ToastState,
  AriaToastRegionProps,
  AriaToastProps,
} from '@koobiq/react-primitives';
import { createPortal } from 'react-dom';

import { Button } from '../Button';

import s from './Toast.module.css';

interface ToastProps<T> extends AriaToastProps<T> {
  state: ToastState<T>;
}

function Toast<T extends ReactNode>({ state, ...props }: ToastProps<T>) {
  const ref = useRef(null);

  const { toastProps, contentProps, titleProps, closeButtonProps } = useToast(
    props,
    state,
    ref
  );

  return (
    <div {...toastProps} ref={ref} className="toast">
      <div {...contentProps}>
        <div {...titleProps}>{props.toast.content}</div>
      </div>
      <Button {...closeButtonProps}>x</Button>
    </div>
  );
}

interface ToastRegionProps<T> extends AriaToastRegionProps {
  state: ToastState<T>;
}

function ToastRegion<T extends ReactNode>({
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

export function ToastProvider<T extends ReactNode>({ children, ...props }) {
  const state = useToastState<T>({
    maxVisibleToasts: 5,
  });

  return (
    <>
      {children(state)}
      {state.visibleToasts.length > 0 && (
        <ToastRegion {...props} state={state} />
      )}
    </>
  );
}
