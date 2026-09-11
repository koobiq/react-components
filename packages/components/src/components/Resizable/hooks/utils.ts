import type {
  ResizableBounds,
  ResizableHandleDirection,
  ResizableSize,
  ResizableSizeConstraints,
} from './types';

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

const clampAxis = (value: number | undefined, min: number, max: number) =>
  clamp(isFiniteNumber(value) ? value : min, min, max);

export const clampResizableSize = (
  size: ResizableSize,
  bounds: ResizableBounds
): ResizableSize => ({
  width: clampAxis(size.width, bounds.minWidth, bounds.maxWidth),
  height: clampAxis(size.height, bounds.minHeight, bounds.maxHeight),
});

/**
 * Clamps only the axes the size defines, so an element can be managed in one
 * dimension and keep its CSS size in the other.
 */
export const normalizeResizableSize = (
  size: ResizableSizeConstraints | undefined,
  bounds: ResizableBounds
): ResizableSizeConstraints | undefined => {
  if (!size) return undefined;

  const { width, height } = size;

  return {
    ...(width !== undefined && {
      width: clampAxis(width, bounds.minWidth, bounds.maxWidth),
    }),
    ...(height !== undefined && {
      height: clampAxis(height, bounds.minHeight, bounds.maxHeight),
    }),
  };
};

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
