import { forwardRef } from 'react';

import { useDOMRef } from '@koobiq/react-core';
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

  const domRef = useDOMRef<HTMLDivElement>(ref);

  const state = useOverlayTriggerState({
    isOpen,
    onOpenChange,
    defaultOpen,
  });

  const { panelProps, panelRef, bodyProps } = useContentPanel(props, state);

  return (
    <Provider
      values={[
        [ContentPanelStateContext, { state, containerRef: domRef }],
        [ContentPanelContext, { ...panelProps, ref: panelRef }],
        [
          ButtonContext,
          {
            slots: {
              [DEFAULT_SLOT]: {},
              trigger: {
                onPress: state.toggle,
              },
            },
          },
        ],
      ]}
    >
      <div className={s.base} ref={domRef}>
        <div {...bodyProps} className={s.body}>
          {children}
        </div>
      </div>
    </Provider>
  );
});

ContentPanelContainer.displayName = 'ContentPanelContainer';
