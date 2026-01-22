'use client';

import type { HTMLAttributes, RefObject } from 'react';
import { useRef, useMemo } from 'react';

import { useResizeObserverRefs } from '@koobiq/react-core';
import type { ButtonBaseProps } from '@koobiq/react-primitives';
import type { OverlayTriggerState } from '@react-stately/overlays';

export type UseContentPanelReturnValue = {
  panelWidth: number;
  panelRef: RefObject<HTMLElement | null>;
  triggerProps: ButtonBaseProps;
  closeButtonProps: ButtonBaseProps;
  panelProps?: HTMLAttributes<HTMLElement>;
  bodyProps?: HTMLAttributes<HTMLElement>;
};

function measureInlineSize(el: HTMLElement | null) {
  if (!el) return 0;
  const cs = getComputedStyle(el);
  const mis = parseFloat(cs.marginInlineStart) || 0;
  const mie = parseFloat(cs.marginInlineEnd) || 0;

  return mis + mie + el.getBoundingClientRect().width;
}

export function useContentPanel(
  state: OverlayTriggerState
): UseContentPanelReturnValue {
  const { isOpen } = state;

  const panelRef = useRef<HTMLElement | null>(null);

  const refArr = useMemo(() => [panelRef], [panelRef.current, isOpen]);

  const [panelWidth] = useResizeObserverRefs(refArr, (el) => {
    if (el) return measureInlineSize(el);

    return 0;
  });

  return {
    panelRef,
    panelWidth,
    triggerProps: { onPress: state.open },
    closeButtonProps: { onPress: state.close },
  };
}
