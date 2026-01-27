'use client';

import type { CSSProperties, HTMLAttributes } from 'react';
import { useCallback, useMemo, useRef } from 'react';

import {
  useMove,
  isNumber,
  mergeProps,
  useControlledState,
} from '@koobiq/react-core';

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

export type UseContentPanelResizeProps = {
  isResizable?: boolean;
  width?: number | null;
  defaultWidth?: number | null;
  minWidth?: number | null;
  maxWidth?: number | null;
  onResize?: (width: number) => void;
  onResizeStart?: () => void;
  onResizeEnd?: (width: number) => void;
};

export type UseContentPanelResizeReturnValue = {
  width: number;
  panelRef: (node: HTMLElement | null) => void;
  panelProps: HTMLAttributes<HTMLElement>;
  resizerProps: HTMLAttributes<HTMLElement>;
};

export function useContentPanel(
  props: UseContentPanelResizeProps
): UseContentPanelResizeReturnValue {
  const {
    isResizable = false,
    width: widthProp,
    defaultWidth,
    minWidth,
    maxWidth,
    onResize,
    onResizeStart,
    onResizeEnd,
  } = props;

  const min = isNumber(minWidth) ? minWidth : 0;
  const max = isNumber(maxWidth) ? maxWidth : Number.POSITIVE_INFINITY;

  const controlledWidth = isNumber(widthProp)
    ? clamp(widthProp, min, max)
    : undefined;

  const defaultUncontrolled = isNumber(defaultWidth)
    ? clamp(defaultWidth, min, max)
    : 0;

  const [width, setWidth] = useControlledState<number>(
    controlledWidth,
    defaultUncontrolled,
    onResize
  );

  // Init from DOM only when: resizable + uncontrolled + no defaultWidth.
  const didInitFromDomRef = useRef(false);

  const panelRef = useCallback(
    (node: HTMLElement | null) => {
      if (!node) return;

      if (!isResizable) return;
      if (controlledWidth !== undefined) return;
      if (isNumber(defaultWidth)) return;
      if (didInitFromDomRef.current) return;

      const domWidth = node.getBoundingClientRect().width;

      if (domWidth > 0) {
        setWidth(clamp(domWidth, min, max));
        didInitFromDomRef.current = true;
      }
    },
    [isResizable, controlledWidth, defaultWidth, min, max, setWidth]
  );

  const { moveProps } = useMove({
    onMoveStart() {
      if (!isResizable) return;

      document.body.dataset.resizing = 'true';
      onResizeStart?.();
    },
    onMoveEnd() {
      if (!isResizable) return;

      delete document.body.dataset.resizing;
      onResizeEnd?.(Math.round(width));
    },
    onMove(e) {
      if (!isResizable) return;
      setWidth((w) => clamp(w - e.deltaX, min, max));
    },
  });

  const resizerProps = useMemo(() => {
    if (!isResizable) {
      return {
        tabIndex: -1,
        'aria-hidden': 'true',
      } as HTMLAttributes<HTMLElement>;
    }

    const aria: HTMLAttributes<HTMLElement> = {
      'aria-label': 'Resize panel',
      'aria-valuenow': Math.round(width),
    };

    if (isNumber(minWidth)) aria['aria-valuemin'] = min;
    if (isNumber(maxWidth)) aria['aria-valuemax'] = max;

    return mergeProps(aria, moveProps);
  }, [isResizable, width, minWidth, maxWidth, min, max, moveProps]);

  const panelProps = useMemo(() => {
    if (!isResizable) return {};

    // Controlled: always apply width.
    if (controlledWidth !== undefined) {
      return { style: { width } as CSSProperties };
    }

    // Uncontrolled with defaultWidth: apply immediately.
    if (isNumber(defaultWidth)) {
      return { style: { width } as CSSProperties };
    }

    // Uncontrolled without defaultWidth: don't set style.width until we've initialized it from the DOM
    // (otherwise the initial 0 would collapse the panel).
    if (!didInitFromDomRef.current || width <= 0) return {};

    return { style: { width } as CSSProperties };
  }, [isResizable, controlledWidth, defaultWidth, width]);

  return { panelRef, width, panelProps, resizerProps };
}
