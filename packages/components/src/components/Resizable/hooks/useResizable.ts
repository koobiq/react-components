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

  const observedSize = clampResizableSize({ width, height }, bounds);

  const currentSize = clampResizableSize(
    {
      width: managedSize?.width ?? observedSize.width,
      height: managedSize?.height ?? observedSize.height,
    },
    bounds
  );

  const handleMoveStart = useCallback(
    (direction: ResizableHandleDirection) => {
      const rect = targetRef.current?.getBoundingClientRect();

      // A managed axis is the source of truth, the measured one may lag behind
      // it while the element animates to the size that was set last.
      startResize(direction, {
        width: managedSize?.width ?? rect?.width ?? currentSize.width,
        height: managedSize?.height ?? rect?.height ?? currentSize.height,
      });
    },
    [currentSize, managedSize, startResize, targetRef]
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
