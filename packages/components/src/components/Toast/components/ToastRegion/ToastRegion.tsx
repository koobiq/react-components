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

import type { ToastProps } from '../../index';
import { Toast } from '../Toast';

import s from './ToastRegion.module.css';

export type ToastRegionProps = AriaToastRegionProps & {
  state: ToastState<ToastProps>;
};

export function ToastRegion({ state, ...props }: ToastRegionProps) {
  const { isBrowser } = useSsr();
  const ref = useRef(null);
  const { regionProps } = useToastRegion(props, state, ref);
  const { getContainer } = useUNSAFE_PortalContext();

  const total = state.visibleToasts.length;

  const refs = useRefs<HTMLDivElement>(total);

  const portalContainer = getContainer ? getContainer() : document.body;
  if (!portalContainer || !isBrowser) return null;

  return createPortal(
    <Transition in={total > 0} timeout={300} mountOnEnter unmountOnExit>
      {(transition) => (
        <div
          {...regionProps}
          ref={ref}
          className={s.base}
          data-transition={transition}
        >
          <TransitionGroup component={null} appear enter exit>
            {state.visibleToasts.toReversed().map((toast, index) => (
              <Transition
                key={toast.key}
                timeout={300}
                nodeRef={refs[index]}
                unmountOnExit
              >
                {(toastTransition) => (
                  <Toast
                    key={toast.key}
                    toast={toast}
                    state={state}
                    innerRef={refs[index]}
                    data-transition={toastTransition}
                  />
                )}
              </Transition>
            ))}
          </TransitionGroup>
        </div>
      )}
    </Transition>,
    portalContainer
  );
}
