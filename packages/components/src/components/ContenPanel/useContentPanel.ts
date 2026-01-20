import type { HTMLAttributes } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { ButtonBaseProps } from '@koobiq/react-primitives';
import type { OverlayTriggerState } from '@react-stately/overlays';

export type UseContentPanelProps = object;

export type UseContentPanelReturnValue = {
  panelRef: (node: HTMLElement | null) => void;
  panelWidth: number;
  panelProps?: HTMLAttributes<HTMLElement>;
  bodyProps?: HTMLAttributes<HTMLElement>;
  triggerProps: ButtonBaseProps;
  closeButtonProps: ButtonBaseProps;
};

function measureInlineSize(el: HTMLElement | null) {
  if (!el) return 0;
  const cs = getComputedStyle(el);
  const mis = parseFloat(cs.marginInlineStart) || 0;
  const mie = parseFloat(cs.marginInlineEnd) || 0;

  return mis + mie + el.getBoundingClientRect().width;
}

export function useContentPanel(
  _: UseContentPanelProps,
  state: OverlayTriggerState
): UseContentPanelReturnValue {
  const elRef = useRef<HTMLElement | null>(null);
  const [el, setEl] = useState<HTMLElement | null>(null);

  const panelRef = useCallback((node: HTMLElement | null) => {
    if (elRef.current === node) return;
    elRef.current = node;
    setEl(node);
  }, []);

  const [panelWidth, setPanelWidth] = useState(0);
  const didInitialMeasureRef = useRef(false);

  useEffect(() => {
    if (!state.isOpen) {
      didInitialMeasureRef.current = false;
      setPanelWidth(0);

      return undefined;
    }

    const measure = () => {
      setPanelWidth(measureInlineSize(elRef.current));
      didInitialMeasureRef.current = true;
    };

    measure();
    const id = requestAnimationFrame(measure);

    return () => cancelAnimationFrame(id);
  }, [state.isOpen, el]);

  useEffect(() => {
    if (!state.isOpen || !el) return undefined;

    const observer = new ResizeObserver(() => {
      if (!didInitialMeasureRef.current) return;
      setPanelWidth(measureInlineSize(elRef.current));
    });

    observer.observe(el);

    return () => observer.disconnect();
  }, [state.isOpen, el]);

  return {
    panelRef,
    panelWidth,
    triggerProps: { onPress: state.open },
    closeButtonProps: { onPress: state.close },
  };
}
