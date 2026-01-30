'use client';

import type { HTMLAttributes } from 'react';
import { useCallback, useMemo, useRef } from 'react';

import {
  isNumber,
  mergeProps,
  useControlledState,
  useMove,
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
  onResizeStart?: (width: number) => void;
  onResizeEnd?: (width: number) => void;
  onResetResize?: (initialWidth: number) => number | null | undefined;
};

export type UseContentPanelResizeReturnValue = {
  width?: number;
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
    onResetResize,
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

  const [width, setWidth] = useControlledState(
    controlledWidth,
    defaultUncontrolled,
    onResize
  );

  const widthRef = useRef(width);
  widthRef.current = width;

  const initialResetRef = useRef<number | null>(null);

  if (initialResetRef.current == null) {
    initialResetRef.current = isNumber(widthProp)
      ? clamp(widthProp, min, max)
      : defaultUncontrolled;
  }

  const onReset = useCallback(() => {
    if (!isResizable) return;

    const initial = initialResetRef.current ?? 0;
    const nextRaw = onResetResize?.(initial);

    const next = clamp(isNumber(nextRaw) ? nextRaw : initial, min, max);

    setWidth(next);
  }, [isResizable, onResetResize, min, max, setWidth]);

  const { moveProps } = useMove({
    onMoveStart() {
      if (!isResizable) return;

      document.body.dataset.resizing = 'true';
      onResizeStart?.(Math.round(widthRef.current));
    },
    onMoveEnd() {
      if (!isResizable) return;

      delete document.body.dataset.resizing;
      onResizeEnd?.(Math.round(widthRef.current));
    },
    onMove(e) {
      if (!isResizable) return;

      setWidth((w) => {
        const next = clamp(w - e.deltaX, min, max);
        widthRef.current = next;

        return next;
      });
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

    return mergeProps(aria, { onDoubleClick: onReset }, moveProps);
  }, [isResizable, width, minWidth, maxWidth, min, max, moveProps, onReset]);

  return { width: isResizable ? width : undefined, resizerProps };
}
