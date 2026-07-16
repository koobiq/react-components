import type { CSSProperties } from 'react';

import type {
  ResizableHandleDirection,
  ResizableSize,
  ResizableSizeConstraints,
} from './types';

export type ResizableBounds = {
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
};

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

export const getResizableBounds = (
  minSize?: ResizableSizeConstraints,
  maxSize?: ResizableSizeConstraints
): ResizableBounds => {
  const minWidth = Math.max(
    0,
    isFiniteNumber(minSize?.width) ? minSize.width : 0
  );

  const minHeight = Math.max(
    0,
    isFiniteNumber(minSize?.height) ? minSize.height : 0
  );

  return {
    minWidth,
    minHeight,
    maxWidth: isFiniteNumber(maxSize?.width)
      ? Math.max(minWidth, maxSize.width)
      : Number.POSITIVE_INFINITY,
    maxHeight: isFiniteNumber(maxSize?.height)
      ? Math.max(minHeight, maxSize.height)
      : Number.POSITIVE_INFINITY,
  };
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

export const clampResizableSize = (
  size: ResizableSize,
  bounds: ResizableBounds
): ResizableSize => ({
  width: clamp(
    isFiniteNumber(size.width) ? size.width : bounds.minWidth,
    bounds.minWidth,
    bounds.maxWidth
  ),
  height: clamp(
    isFiniteNumber(size.height) ? size.height : bounds.minHeight,
    bounds.minHeight,
    bounds.maxHeight
  ),
});

export const normalizeResizableSize = (
  size: ResizableSize | undefined,
  bounds: ResizableBounds
) => (size ? clampResizableSize(size, bounds) : undefined);

export const getDirectionKey = ([x, y]: ResizableHandleDirection) =>
  `${x}:${y}`;

export const isResizableHandleDirection = (
  direction: readonly number[]
): direction is ResizableHandleDirection => {
  const [x, y] = direction;

  return (
    direction.length === 2 &&
    (x === -1 || x === 0 || x === 1) &&
    (y === -1 || y === 0 || y === 1) &&
    (x !== 0 || y !== 0)
  );
};

const handleSize = 'var(--kbq-resizable-handle-size)';

export const getHandlePositionStyle = ([
  x,
  y,
]: ResizableHandleDirection): CSSProperties => {
  const style: CSSProperties = {
    width: x === 0 ? '100%' : handleSize,
    height: y === 0 ? '100%' : handleSize,
  };

  const translateX = x === -1 ? '-50%' : x === 1 ? '50%' : '0';
  const translateY = y === -1 ? '-50%' : y === 1 ? '50%' : '0';

  if (x === -1) style.left = 0;
  if (x === 0) style.left = 0;
  if (x === 1) style.right = 0;
  if (y === -1) style.top = 0;
  if (y === 0) style.top = 0;
  if (y === 1) style.bottom = 0;

  style.transform = `translate(${translateX}, ${translateY})`;

  return style;
};
