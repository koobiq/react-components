'use client';

import { type CSSProperties } from 'react';
import { useMemo, useRef, forwardRef, useState } from 'react';

import {
  clsx,
  mergeProps,
  useMultiRef,
  useResizeObserverRefs,
} from '@koobiq/react-core';
import {
  ButtonContext,
  DEFAULT_SLOT,
  Provider,
  useOverlayTriggerState,
} from '@koobiq/react-primitives';

import { TRANSITION_TIMEOUT } from '../../constants';
import { ContentPanelContext } from '../../ContentPanelContext';
import { useContentPanelContainer } from '../../hooks';
import { getInlineSize } from '../../utils';

import s from './ContentPanelContainer.module.css';
import { ContentPanelContainerContext } from './ContentPanelContainerContext';
import type {
  ContentPanelContainerProps,
  ContentPanelContainerRef,
} from './types';

export const ContentPanelContainer = forwardRef<
  ContentPanelContainerRef,
  ContentPanelContainerProps
>((props, ref) => {
  const {
    children,
    isOpen,
    onOpenChange,
    disableExitOnEscapeKeyDown,
    defaultOpen,
    className,
    slotProps,
    ...other
  } = props;

  const state = useOverlayTriggerState({
    isOpen,
    onOpenChange,
    defaultOpen,
  });

  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null
  );

  const { triggerProps, containerProps } = useContentPanelContainer(
    { isKeyboardDismissDisabled: !!disableExitOnEscapeKeyDown },
    state
  );

  const containerRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const domRef = useMultiRef<HTMLElement>([
    ref,
    containerRef,
    setPortalContainer,
  ]);

  const observedRefs = useMemo(
    () => [containerRef, panelRef],
    [panelRef.current, containerRef.current, state.isOpen]
  );

  const [containerWidth, panelWidth] = useResizeObserverRefs(
    observedRefs,
    (el) => {
      if (el) return getInlineSize(el);

      return 0;
    }
  );

  const rootProps = mergeProps(
    {
      className: clsx(s.base, className),
      ref: domRef,
      ...other,
    },
    containerProps
  );

  const bodyProps = {
    ...slotProps?.body,
    className: clsx(s.body, slotProps?.body?.className),
    children: typeof children === 'function' ? children(state) : children,
    style: {
      ...slotProps?.body?.style,
      '--content-panel-inline-size': `${panelWidth}px`,
      '--content-body-transition-duration': `${TRANSITION_TIMEOUT}ms`,
    } as CSSProperties,
  };

  return (
    <Provider
      values={[
        [
          ContentPanelContainerContext,
          {
            state,
            containerWidth: containerWidth || undefined,
            portalContainer,
          },
        ],
        [
          ContentPanelContext,
          {
            ref: panelRef,
            className: s.panel,
            disableExitOnEscapeKeyDown,
          },
        ],
        [
          ButtonContext,
          {
            slots: {
              [DEFAULT_SLOT]: {},
              trigger: triggerProps,
            },
          },
        ],
      ]}
    >
      <div {...rootProps}>
        <div {...bodyProps} />
      </div>
    </Provider>
  );
});

ContentPanelContainer.displayName = 'ContentPanelContainer';
