'use client';

import type { CSSProperties } from 'react';
import { useCallback, useId, useMemo } from 'react';

import { useElementSize } from '@koobiq/react-core';

import type {
  ResizableHandleDirection,
  ResizableMoveEvent,
  ResizableSize,
  ResizableSizeConstraints,
} from './types';
import type { ResizableState } from './useResizableState';
import { clampResizableSize } from './utils';

export type ResizableContextValue = {
  rootId: string;
  /** The current size of both axes, measured where an axis isn't managed. */
  size: ResizableSize;
  bounds: ResizableState['bounds'];
  isDisabled: boolean;
  activeDirection: string | null;
  onMoveStart: (direction: ResizableHandleDirection) => void;
  onMove: (event: ResizableMoveEvent) => void;
  onMoveEnd: () => void;
};

export type UseResizableProps = {
  id?: string;
  minSize?: ResizableSizeConstraints;
};

/** Provides DOM props and observed sizing for a resizable target element. */
export const useResizable = <T extends HTMLElement = HTMLElement>(
  props: UseResizableProps,
  state: ResizableState
) => {
  const { id: idProp, minSize } = props;

  const {
    size: managedSize,
    bounds,
    isDisabled,
    activeDirection,
    startResize,
    resize,
    endResize,
  } = state;

  const generatedId = useId();
  const rootId = idProp ?? generatedId;

  const {
    ref: targetRef,
    width,
    height,
  } = useElementSize<T>({ box: 'border-box' });

  const currentSize = useMemo(
    () =>
      clampResizableSize(
        {
          width: managedSize?.width ?? width,
          height: managedSize?.height ?? height,
        },
        bounds
      ),
    [managedSize?.width, managedSize?.height, width, height, bounds]
  );

  // Starts from the size the handles announce. The element may lag behind a
  // managed axis while it animates, and CSS transforms would scale its rect.
  const handleMoveStart = useCallback(
    (direction: ResizableHandleDirection) =>
      startResize(direction, currentSize),
    [currentSize, startResize]
  );

  const contextValue = useMemo<ResizableContextValue>(
    () => ({
      rootId,
      size: currentSize,
      bounds,
      isDisabled,
      activeDirection,
      onMoveStart: handleMoveStart,
      onMove: resize,
      onMoveEnd: endResize,
    }),
    [
      rootId,
      currentSize,
      bounds,
      isDisabled,
      activeDirection,
      handleMoveStart,
      resize,
      endResize,
    ]
  );

  const style = {
    ...(minSize?.width !== undefined && { minWidth: bounds.minWidth }),
    ...(minSize?.height !== undefined && { minHeight: bounds.minHeight }),
    ...(Number.isFinite(bounds.maxWidth) && { maxWidth: bounds.maxWidth }),
    ...(Number.isFinite(bounds.maxHeight) && { maxHeight: bounds.maxHeight }),
    ...(managedSize?.width !== undefined && { width: managedSize.width }),
    ...(managedSize?.height !== undefined && { height: managedSize.height }),
  } satisfies CSSProperties;

  const resizableProps = {
    ref: targetRef,
    id: rootId,
    style,
    'data-resizing': activeDirection ? true : undefined,
    'data-disabled': isDisabled || undefined,
  };

  return { resizableProps, contextValue };
};
