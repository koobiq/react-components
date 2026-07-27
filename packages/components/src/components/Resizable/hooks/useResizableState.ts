'use client';

import { useCallback, useMemo, useRef, useState } from 'react';

import { useControlledState } from '@koobiq/react-core';

import type {
  ResizableHandleDirection,
  ResizableMoveEvent,
  ResizableSize,
  ResizableSizeConstraints,
} from './types';
import {
  clampResizableSize,
  getDirectionKey,
  getResizableBounds,
  normalizeResizableSize,
} from './utils';

export type ResizableState = {
  size: ResizableSize | null;
  bounds: ReturnType<typeof getResizableBounds>;
  isDisabled: boolean;
  activeDirection: string | null;
  startResize: (
    direction: ResizableHandleDirection,
    startSize: ResizableSize
  ) => void;
  resize: (event: ResizableMoveEvent) => void;
  endResize: () => void;
};

export type UseResizableStateProps = {
  size?: ResizableSize;
  defaultSize?: ResizableSize;
  minSize?: ResizableSizeConstraints;
  maxSize?: ResizableSizeConstraints;
  isDisabled?: boolean;
  onResize?: (size: ResizableSize) => void;
  onResizeStart?: (size: ResizableSize) => void;
  onResizeEnd?: (size: ResizableSize) => void;
};

/** Provides state and calculations for a resizable element. */
export const useResizableState = (
  props: UseResizableStateProps
): ResizableState => {
  const {
    size: sizeProp,
    defaultSize: defaultSizeProp,
    minSize,
    maxSize,
    isDisabled = false,
    onResize,
    onResizeStart,
    onResizeEnd,
  } = props;

  const bounds = useMemo(
    () => getResizableBounds(minSize, maxSize),
    [minSize?.width, minSize?.height, maxSize?.width, maxSize?.height]
  );

  const controlledSize = useMemo(
    () => normalizeResizableSize(sizeProp, bounds),
    [sizeProp?.width, sizeProp?.height, bounds]
  );

  const defaultSize = useMemo(
    () => normalizeResizableSize(defaultSizeProp, bounds),
    [defaultSizeProp?.width, defaultSizeProp?.height, bounds]
  );

  const [managedSize, setManagedSize] = useControlledState<
    ResizableSize | null,
    ResizableSize
  >(controlledSize, defaultSize ?? null, onResize);

  const startSizeRef = useRef<ResizableSize>({ width: 0, height: 0 });
  const lastSizeRef = useRef<ResizableSize>({ width: 0, height: 0 });
  const accumulatedRef = useRef({ x: 0, y: 0 });
  const directionRef = useRef<ResizableHandleDirection>([1, 1]);
  const [activeDirection, setActiveDirection] = useState<string | null>(null);

  const startResize = useCallback(
    (direction: ResizableHandleDirection, startSize: ResizableSize) => {
      const clampedStartSize = clampResizableSize(startSize, bounds);

      startSizeRef.current = clampedStartSize;
      lastSizeRef.current = clampedStartSize;
      accumulatedRef.current = { x: 0, y: 0 };
      directionRef.current = direction;
      setActiveDirection(getDirectionKey(direction));
      onResizeStart?.(clampedStartSize);
    },
    [bounds, onResizeStart]
  );

  const resize = useCallback(
    (event: ResizableMoveEvent) => {
      const multiplier =
        event.pointerType === 'keyboard' && event.shiftKey ? 10 : 1;

      accumulatedRef.current.x += event.deltaX * multiplier;
      accumulatedRef.current.y += event.deltaY * multiplier;

      const [x, y] = directionRef.current;
      const startSize = startSizeRef.current;

      const nextSize = clampResizableSize(
        {
          width:
            x === 0
              ? startSize.width
              : startSize.width + accumulatedRef.current.x * x,
          height:
            y === 0
              ? startSize.height
              : startSize.height + accumulatedRef.current.y * y,
        },
        bounds
      );

      lastSizeRef.current = nextSize;
      setManagedSize(nextSize);
    },
    [bounds, setManagedSize]
  );

  const endResize = useCallback(() => {
    setActiveDirection(null);
    onResizeEnd?.(lastSizeRef.current);
  }, [onResizeEnd]);

  return useMemo(
    () => ({
      size: managedSize,
      bounds,
      isDisabled,
      activeDirection,
      startResize,
      resize,
      endResize,
    }),
    [
      managedSize,
      bounds,
      isDisabled,
      activeDirection,
      startResize,
      resize,
      endResize,
    ]
  );
};
