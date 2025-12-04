'use client';

import { forwardRef, type Ref } from 'react';

import { clsx, useDOMRef, useRefs, useSsr } from '@koobiq/react-core';
import {
  useToastRegion,
  // eslint-disable-next-line camelcase
  useUNSAFE_PortalContext,
} from '@koobiq/react-primitives';
import { createPortal } from 'react-dom';
import { Transition, TransitionGroup } from 'react-transition-group';

import { Toast } from '../Toast';

import s from './ToastRegion.module.css';
import type { ToastRegionComponent, ToastRegionProps } from './types';

export function ToastRegionRender(
  { state, placement = 'top-end', ...props }: Omit<ToastRegionProps, 'ref'>,
  ref: Ref<HTMLDivElement>
) {
  const { isBrowser } = useSsr();
  const domRef = useDOMRef<HTMLDivElement>(ref);
  const { regionProps } = useToastRegion(props, state, domRef);
  const { getContainer } = useUNSAFE_PortalContext();

  const total = state.visibleToasts.length;

  const refs = useRefs<HTMLDivElement>(total);

  const portalContainer = getContainer ? getContainer() : document.body;
  if (!portalContainer || !isBrowser) return null;

  return createPortal(
    <Transition
      in={total > 0}
      timeout={300}
      nodeRef={domRef}
      mountOnEnter
      unmountOnExit
    >
      {(transition) => (
        <div
          {...regionProps}
          ref={domRef}
          className={clsx(s.base, s[placement])}
          data-placement={placement}
          data-transition={transition}
        >
          <TransitionGroup component={null} appear enter exit>
            {state.visibleToasts.map((toast, index) => (
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

export const ToastRegion = forwardRef(
  ToastRegionRender
) as ToastRegionComponent;
