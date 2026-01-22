'use client';

import type { CSSProperties } from 'react';
import { forwardRef, useState } from 'react';

import { useMultiRef, clsx, mergeProps } from '@koobiq/react-core';
import {
  ButtonContext,
  DEFAULT_SLOT,
  Provider,
  useOverlayTriggerState,
} from '@koobiq/react-primitives';

import { ContentPanelContext } from '../../ContentPanelContext';
import { useContentPanel } from '../../hooks';

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

  const { panelRef, panelWidth, triggerProps, containerProps } =
    useContentPanel(state);

  const domRef = useMultiRef([ref, setPortalContainer]);

  const rootProps = {
    className: clsx(s.base, className),
    ref: domRef,
    ...other,
  };

  return (
    <Provider
      values={[
        [ContentPanelContainerContext, { state, portalContainer }],
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
