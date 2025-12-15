'use client';

import { type CSSProperties, forwardRef, type Ref, useEffect } from 'react';

import {
  clsx,
  useDOMRef,
  useSsr,
  useBoolean,
  useTimeout,
  mergeProps,
  useKeyedRefs,
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
  {
    state,
    placement = 'top-end',
    stackDirection = 'ascending',
    ...props
  }: Omit<ToastRegionProps, 'ref'>,
  ref: Ref<HTMLDivElement>
) {
  const { isBrowser } = useSsr();
  const domRef = useDOMRef<HTMLDivElement>(ref);
  const { regionProps: regionPropsAria } = useToastRegion(props, state, domRef);
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

  const getNodeRef = useKeyedRefs<HTMLDivElement>();

  const portalContainer = getContainer ? getContainer() : document.body;
  if (!portalContainer || !isBrowser || !isMounted) return null;

  const regionProps = mergeProps(
    regionPropsAria,
    {
      className: clsx(s.base, s[placement], s[stackDirection]),
      'data-placement': placement,
      'data-stack-direction': stackDirection,
      ref: domRef,
    },
    props
  );

  const visibleToasts =
    stackDirection === 'ascending'
      ? [...state.visibleToasts].reverse()
      : state.visibleToasts;

  return createPortal(
    <div {...regionProps}>
      <TransitionGroup component={null} appear enter>
        {visibleToasts.map((toast, idx) => {
          const nodeRef = getNodeRef(toast.key);

          return (
            <Transition
              key={toast.key}
              timeout={TRANSITION_TIMEOUT}
              nodeRef={nodeRef}
              unmountOnExit
            >
              {(transition) => {
                const inner = nodeRef.current?.children[0];

                return (
                  <Toast
                    toast={toast}
                    state={state}
                    innerRef={nodeRef}
                    data-transition={transition}
                    data-placement={placement}
                    style={
                      {
                        '--toast-transition-z-index':
                          stackDirection === 'ascending'
                            ? -(idx + 1)
                            : -(total - (idx + 1)),
                        '--toast-transition-block-size': `${inner?.clientHeight}px`,
                        '--toast-transition-duration': `${TRANSITION_TIMEOUT}ms`,
                      } as CSSProperties
                    }
                  />
                );
              }}
            </Transition>
          );
        })}
      </TransitionGroup>
    </div>,
    portalContainer
  );
}

export const ToastRegion = forwardRef(
  ToastRegionRender
) as ToastRegionComponent;
