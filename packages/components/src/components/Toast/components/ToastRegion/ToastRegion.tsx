'use client';

import { useRef } from 'react';

import { useRefs, useSsr } from '@koobiq/react-core';
import {
  type AriaToastRegionProps,
  type ToastState,
  useToastRegion,
  // eslint-disable-next-line camelcase
  useUNSAFE_PortalContext,
} from '@koobiq/react-primitives';
import { createPortal } from 'react-dom';
import { Transition, TransitionGroup } from 'react-transition-group';

import type { MyToast } from '../Toast';
import { Toast } from '../Toast';

import s from './ToastRegion.module.css';

export type ToastRegionProps<T> = AriaToastRegionProps & {
  state: ToastState<T>;
};

export function ToastRegion<T extends object = MyToast>({
  state,
  ...props
}: ToastRegionProps<T>) {
  const { isBrowser } = useSsr();
  const ref = useRef(null);
  const { regionProps } = useToastRegion(props, state, ref);
  const { getContainer } = useUNSAFE_PortalContext();

  const refs = useRefs<HTMLDivElement>(state.visibleToasts.length);

  let portalContainer;

  if (isBrowser) {
    portalContainer = document.body;

    if (getContainer) {
      portalContainer = getContainer();
    }
  }

  return portalContainer
    ? createPortal(
        <div {...regionProps} ref={ref} className={s.base}>
          <TransitionGroup component={null} appear enter exit>
            {state.visibleToasts.map((toast, index) => (
              <Transition
                key={toast.key}
                timeout={300}
                nodeRef={refs[index]}
                unmountOnExit
              >
                {(transition) => (
                  <Toast
                    key={toast.key}
                    toast={toast}
                    state={state}
                    innerRef={refs[index]}
                    data-transition={transition}
                  />
                )}
              </Transition>
            ))}
          </TransitionGroup>
        </div>,
        portalContainer
      )
    : null;
}
