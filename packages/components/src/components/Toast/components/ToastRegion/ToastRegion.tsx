'use client';

import { type CSSProperties, forwardRef, type Ref, useEffect } from 'react';

import {
  clsx,
  useDOMRef,
  useRefs,
  useSsr,
  useBoolean,
  useTimeout,
} from '@koobiq/react-core';
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

const TRANSITION_TIMEOUT = 300;

export function ToastRegionRender(
  { state, placement = 'top-end', ...props }: Omit<ToastRegionProps, 'ref'>,
  ref: Ref<HTMLDivElement>
) {
  const { isBrowser } = useSsr();
  const domRef = useDOMRef<HTMLDivElement>(ref);
  const { regionProps } = useToastRegion(props, state, domRef);
  const { getContainer } = useUNSAFE_PortalContext();
  const [isMounted, { on, off }] = useBoolean(false);

  const total = state.visibleToasts.length;

  useEffect(() => {
    if (total) on();
  }, [total, on]);

  useTimeout(
    () => {
      if (!total) off();
    },
    total ? null : TRANSITION_TIMEOUT
  );

  const refs = useRefs<HTMLDivElement>(total, [state.visibleToasts[0]?.key]);

  const portalContainer = getContainer ? getContainer() : document.body;
  if (!portalContainer || !isBrowser || !isMounted) return null;

  return createPortal(
    <div
      {...regionProps}
      ref={domRef}
      className={clsx(s.base, s[placement])}
      data-placement={placement}
    >
      <TransitionGroup component={null} appear enter>
        {state.visibleToasts.map((toast, index) => (
          <Transition
            key={toast.key}
            timeout={TRANSITION_TIMEOUT}
            nodeRef={refs[index]}
            unmountOnExit
          >
            {(transition) => {
              const inner = refs[index].current?.children[0];

              return (
                <Toast
                  key={toast.key}
                  toast={toast}
                  state={state}
                  innerRef={refs[index]}
                  data-transition={transition}
                  data-placement={placement}
                  style={
                    {
                      '--toast-transition-block-size': `${inner?.clientHeight}px`,
                      '--toast-transition-duration': `${TRANSITION_TIMEOUT}ms`,
                    } as CSSProperties
                  }
                />
              );
            }}
          </Transition>
        ))}
      </TransitionGroup>
    </div>,
    portalContainer
  );
}

export const ToastRegion = forwardRef(
  ToastRegionRender
) as ToastRegionComponent;
