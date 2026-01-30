'use client';

import type { HTMLAttributes } from 'react';

import type { ButtonBaseProps } from '@koobiq/react-primitives';
import type { OverlayTriggerState } from '@react-stately/overlays';

export type UseContentPanelReturnValue = {
  triggerProps: ButtonBaseProps;
  closeButtonProps: ButtonBaseProps;
  containerProps?: HTMLAttributes<HTMLElement>;
  panelProps?: HTMLAttributes<HTMLElement>;
  bodyProps?: HTMLAttributes<HTMLElement>;
};

export function useContentPanelContainer(
  state: OverlayTriggerState
): UseContentPanelReturnValue {
  return {
    containerProps: {
      tabIndex: -1,
      onKeyDown: (event) => {
        if (!state.isOpen) return;
        if (event.key === 'Escape') state.close();
      },
    },
    triggerProps: { onPress: state.open },
    closeButtonProps: { onPress: state.close },
  };
}
