import type { HTMLAttributes, CSSProperties, RefObject } from 'react';
import { useEffect, useState } from 'react';

import { useElementSize } from '@koobiq/react-core';
import type { OverlayTriggerState } from '@react-stately/overlays';

export type UseContentPanelProps = object;
export type UseContentPanelReturnValue = {
  panelRef: RefObject<HTMLElement>;
  panelProps: HTMLAttributes<HTMLElement>;
  bodyProps: HTMLAttributes<HTMLElement>;
  triggerProps: unknown;
  closeButtonProps: unknown;
};

export function useContentPanel(
  _: UseContentPanelProps,
  state: OverlayTriggerState
): UseContentPanelReturnValue {
  const [offsetInline, setOffsetInline] = useState(0);
  const { ref: panelRef } = useElementSize();

  useEffect(() => {
    if (state.isOpen && panelRef.current) {
      const { width } = panelRef.current.getBoundingClientRect();
      setOffsetInline(width);
    }

    if (!state.isOpen) {
      setOffsetInline(0);
    }
  }, [state.isOpen, panelRef.current]);

  return {
    panelRef,
    panelProps: {},
    triggerProps: {},
    closeButtonProps: {},
    bodyProps: {
      style: {
        '--content-panel-offset-inline': `${offsetInline}px`,
      } as CSSProperties,
    },
  };
}
