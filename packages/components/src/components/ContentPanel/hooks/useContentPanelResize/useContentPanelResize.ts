'use client';

import type { MouseEventHandler } from 'react';
import { useCallback, useRef } from 'react';

import {
  isNumber,
  useControlledState,
  useLocale,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';

import type {
  ResizableHandleDirection,
  ResizableProps,
  ResizableSize,
} from '../../../Resizable';
import type { ContentPanelSize } from '../../types';
import { parseContentPanelSize } from '../../utils';

import intlMessages from './intl.json';

/** The width the panel falls back to when `defaultWidth` isn't set. */
const DEFAULT_WIDTH = 400;

/** The width the panel can't be resized below when `minWidth` isn't set. */
const DEFAULT_MIN_WIDTH = 200;

/**
 * The handle sits at the inline start edge of the panel, and `Resizable`
 * directions are physical, so the horizontal axis flips in RTL.
 */
const HANDLE_DIRECTION_LTR: ResizableHandleDirection = [-1, 0];
const HANDLE_DIRECTION_RTL: ResizableHandleDirection = [1, 0];

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

export type UseContentPanelResizeProps = {
  /** If `true`, the panel can be resized by dragging the handle. */
  isResizable?: boolean;
  /** The width of the container the panel is rendered in (in pixels). */
  containerWidth?: number;
  /** The controlled width of the panel. */
  width?: ContentPanelSize | null;
  /** The initial width of the panel when uncontrolled. */
  defaultWidth?: ContentPanelSize | null;
  /** The minimum allowed width of the panel. */
  minWidth?: ContentPanelSize | null;
  /** The maximum allowed width of the panel. */
  maxWidth?: ContentPanelSize | null;
  /** Handler that is called whenever the panel width changes. */
  onResize?: (width: number) => void;
  /** Handler that is called when the user starts resizing the panel. */
  onResizeStart?: (width: number) => void;
  /** Handler that is called when the user finishes resizing the panel. */
  onResizeEnd?: (width: number) => void;
  /**
   * Handler that is called when the panel width is reset (double click on the handle).
   * Receives the initial width and can return the width to apply.
   * If nothing is returned, the panel resets to the initial width.
   */
  onResetResize?: (initialWidth: number) => number | null | undefined;
};

export type UseContentPanelResizeReturnValue = {
  /** Props to spread on the panel `Resizable`. */
  resizableProps: Pick<
    ResizableProps,
    | 'size'
    | 'minSize'
    | 'maxSize'
    | 'onResize'
    | 'onResizeStart'
    | 'onResizeEnd'
  >;
  /** Props to spread on the `Resizable.Handle` of the panel. */
  handleProps: {
    direction: ResizableHandleDirection;
    'aria-label': string;
    onDoubleClick: MouseEventHandler<HTMLElement>;
  };
};

/** Resolves the panel width props into the width-only `Resizable` state. */
export function useContentPanelResize(
  props: UseContentPanelResizeProps
): UseContentPanelResizeReturnValue {
  const {
    isResizable = false,
    containerWidth,
    width,
    defaultWidth,
    minWidth,
    maxWidth,
    onResize,
    onResizeStart,
    onResizeEnd,
    onResetResize,
  } = props;

  const t = useLocalizedStringFormatter(intlMessages);
  const { direction } = useLocale();

  // Percentages resolve against the container, which isn't measured on the
  // first render, so every width is resolved on each render.
  const resolveWidth = (value: ContentPanelSize | null | undefined) =>
    parseContentPanelSize(containerWidth, value);

  const min = Math.max(0, resolveWidth(minWidth) ?? DEFAULT_MIN_WIDTH);

  const max = Math.min(
    containerWidth ?? Number.POSITIVE_INFINITY,
    resolveWidth(maxWidth) ?? Number.POSITIVE_INFINITY
  );

  // `null` until the user resizes the panel, so the default width keeps
  // following the container. `width` stays controlled while it's unresolved.
  const [userWidth, setUserWidth] = useControlledState<number | null, number>(
    width == null ? undefined : resolveWidth(width),
    null,
    onResize
  );

  const panelWidth = clamp(
    userWidth ?? resolveWidth(defaultWidth) ?? DEFAULT_WIDTH,
    min,
    max
  );

  // The width the panel started with, resolved again when it's reset.
  const initialWidthRef = useRef(width ?? defaultWidth);

  const onDoubleClick = useCallback(() => {
    const initialWidth = clamp(
      parseContentPanelSize(containerWidth, initialWidthRef.current) ??
        DEFAULT_WIDTH,
      min,
      max
    );

    const nextWidth = onResetResize?.(initialWidth);

    setUserWidth(
      clamp(isNumber(nextWidth) ? nextWidth : initialWidth, min, max)
    );
  }, [containerWidth, max, min, onResetResize, setUserWidth]);

  const handleResize = useCallback(
    (size: ResizableSize) => setUserWidth(size.width),
    [setUserWidth]
  );

  const handleResizeStart = useCallback(
    (size: ResizableSize) => onResizeStart?.(Math.round(size.width)),
    [onResizeStart]
  );

  const handleResizeEnd = useCallback(
    (size: ResizableSize) => onResizeEnd?.(Math.round(size.width)),
    [onResizeEnd]
  );

  return {
    resizableProps: {
      // The panel only manages its inline size, the block size is left to CSS.
      size: isResizable ? { width: panelWidth } : undefined,
      minSize: isResizable ? { width: min } : undefined,
      maxSize: isResizable ? { width: max } : undefined,
      onResize: handleResize,
      onResizeStart: handleResizeStart,
      onResizeEnd: handleResizeEnd,
    },
    handleProps: {
      direction:
        direction === 'rtl' ? HANDLE_DIRECTION_RTL : HANDLE_DIRECTION_LTR,
      'aria-label': t.format('resize panel'),
      onDoubleClick,
    },
  };
}
