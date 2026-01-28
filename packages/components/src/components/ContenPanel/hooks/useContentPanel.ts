'use client';

import type { HTMLAttributes } from 'react';
import { useMemo } from 'react';

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

  return { width: isResizable ? width : undefined, resizerProps };
}
