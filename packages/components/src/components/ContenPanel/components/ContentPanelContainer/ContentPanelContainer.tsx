'use client';

import { type CSSProperties, useMemo, useRef } from 'react';
import { forwardRef, useState } from 'react';

import {
  useMultiRef,
  clsx,
  mergeProps,
  useResizeObserverRefs,
} from '@koobiq/react-core';
import {
  ButtonContext,
  DEFAULT_SLOT,
  Provider,
  useOverlayTriggerState,
} from '@koobiq/react-primitives';

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
  const { children, isOpen, onOpenChange, defaultOpen, className, ...other } =
    props;

  const state = useOverlayTriggerState({
    isOpen,
    onOpenChange,
    defaultOpen,
  });

  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null
  );

  const { triggerProps, containerProps } = useContentPanelContainer(state);

  const containerRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);

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

  const rootProps = {
    className: clsx(s.base, className),
    ref: domRef,
    ...other,
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
        [ContentPanelContext, { ref: panelRef, className: s.panel }],
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
      <div {...mergeProps(rootProps, containerProps)}>
        <div
          className={s.body}
          style={
            {
              '--content-panel-inline-size': `${panelWidth}px`,
            } as CSSProperties
          }
        >
          {typeof children === 'function' ? children(state) : children}
        </div>
      </div>
    </Provider>
  );
});

ContentPanelContainer.displayName = 'ContentPanelContainer';
