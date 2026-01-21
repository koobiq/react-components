import type { CSSProperties } from 'react';
import { forwardRef, useState } from 'react';

import { useMultiRef, clsx } from '@koobiq/react-core';
import {
  ButtonContext,
  DEFAULT_SLOT,
  Provider,
  useOverlayTriggerState,
} from '@koobiq/react-primitives';

import { ContentPanelContext } from './components';
import s from './ContentPanelContainer.module.css';
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
  const { children, isOpen, onOpenChange, defaultOpen, className, ...other } =
    props;

  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null
  );

  const state = useOverlayTriggerState({
    isOpen,
    onOpenChange,
    defaultOpen,
  });

  const { panelRef, panelWidth, triggerProps } = useContentPanel(props, state);

  const domRef = useMultiRef([ref, setPortalContainer]);

  return (
    <Provider
      values={[
        [ContentPanelStateContext, { state, portalContainer }],
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
      <div className={clsx(s.base, className)} ref={domRef} {...other}>
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
