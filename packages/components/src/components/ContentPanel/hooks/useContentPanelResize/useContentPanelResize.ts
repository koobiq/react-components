'use client';

import type { MouseEventHandler } from 'react';
import { useCallback, useRef } from 'react';

import {
  clamp,
  isNumber,
  useControlledState,
  useLocale,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';

import type {
  ResizableHandleDirection,
  ResizableProps,
  ResizableSize,
  ResizableSizeConstraints,
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

/**
 * Keeps `Resizable` controlled while no axis is managed, so a panel that stops
 * being resizable drops its inline width instead of keeping the last one.
 */
const UNMANAGED_SIZE: ResizableSizeConstraints = {};

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
  const parseWidth = (value: ContentPanelSize | null | undefined) =>
    parseContentPanelSize(containerWidth, value);

  const min = Math.max(0, parseWidth(minWidth) ?? DEFAULT_MIN_WIDTH);

  // Kept at or above `min`, so the two bounds can never cross and the minimum
  // width wins, the way `min-inline-size` does in CSS.
  const max = Math.max(
    min,
    Math.min(
      containerWidth ?? Number.POSITIVE_INFINITY,
      parseWidth(maxWidth) ?? Number.POSITIVE_INFINITY
    )
  );

  /** Turns a width prop into the pixel width the panel can actually take. */
  const resolvePanelWidth = useCallback(
    (value: ContentPanelSize | null | undefined) =>
      clamp(
        parseContentPanelSize(containerWidth, value) ?? DEFAULT_WIDTH,
        min,
        max
      ),
    [containerWidth, max, min]
  );

  // The unmanaged state isn't a width, and `onResize` only reports pixels.
  const handleWidthChange = useCallback(
    (nextWidth: number | null) => {
      if (isNumber(nextWidth)) onResize?.(nextWidth);
    },
    [onResize]
  );

  // `null` until the user resizes the panel, so the width keeps following the
  // container. `width` stays controlled while it's unresolved.
  const [userWidth, setUserWidth] = useControlledState<number | null>(
    width == null ? undefined : parseWidth(width),
    null,
    handleWidthChange
  );

  // The width the panel started with. It's read on every render, so a
  // percentage resolves once the container is measured, and later `defaultWidth`
  // changes are ignored, as with any `default*` prop.
  const initialWidthRef = useRef(width ?? defaultWidth);

  const panelWidth =
    userWidth == null
      ? resolvePanelWidth(initialWidthRef.current)
      : clamp(userWidth, min, max);

  const onDoubleClick = useCallback(() => {
    const initialWidth = resolvePanelWidth(initialWidthRef.current);
    const nextWidth = onResetResize?.(initialWidth);

    if (isNumber(nextWidth)) {
      setUserWidth(clamp(nextWidth, min, max));

      return;
    }

    // Back to the unmanaged width, so the panel keeps following the container
    // and a percentage `defaultWidth` the way it did before the first resize.
    setUserWidth(null);
    onResize?.(initialWidth);
  }, [max, min, onResetResize, onResize, resolvePanelWidth, setUserWidth]);

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
      size: isResizable ? { width: panelWidth } : UNMANAGED_SIZE,
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
