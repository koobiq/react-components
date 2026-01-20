import type { CSSProperties } from 'react';
import { forwardRef, useState } from 'react';

import { useMultiRef } from '@koobiq/react-core';
import {
  ButtonContext,
  DEFAULT_SLOT,
  Provider,
  useOverlayTriggerState,
} from '@koobiq/react-primitives';

import { ContentPanelContext } from './components';
import s from './ContentPanel.module.css';
import { ContentPanelStateContext } from './ContentPanelStateContext';
import type {
  ContentPanelContainerProps,
  ContentPanelContainerRef,
} from './types';
import { useContentPanel } from './useContentPanel';

export const ContentPanelContainer = forwardRef<
  ContentPanelContainerRef,
  ContentPanelContainerProps
>((props, ref) => {
  const { children, isOpen, onOpenChange, defaultOpen } = props;

  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null
  );

  const state = useOverlayTriggerState({
    isOpen,
    onOpenChange,
    defaultOpen,
  });

  const { panelProps, panelRef, panelSize, bodyProps, triggerProps } =
    useContentPanel(props, state);

  const domRef = useMultiRef([ref, setPortalContainer]);

  return (
    <Provider
      values={[
        [ContentPanelStateContext, { state, portalContainer }],
        [ContentPanelContext, { ...panelProps, ref: panelRef }],
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
      <div className={s.base} ref={domRef}>
        <div
          {...bodyProps}
          className={s.body}
          style={
            { '--content-panel-inline-size': `${panelSize}px` } as CSSProperties
          }
        >
          {typeof children === 'function' ? children(state) : children}
        </div>
      </div>
    </Provider>
  );
});

ContentPanelContainer.displayName = 'ContentPanelContainer';
