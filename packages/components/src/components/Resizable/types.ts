import type { ComponentPropsWithRef } from 'react';

export type ResizableSize = {
  /** Width in CSS pixels. */
  width: number;
  /** Height in CSS pixels. */
  height: number;
};

export type ResizableSizeConstraints = Partial<ResizableSize>;

export const resizableHandleDirections = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
] as const;

export type ResizableHandleDirection =
  (typeof resizableHandleDirections)[number];

export type ResizableProps = Omit<ComponentPropsWithRef<'div'>, 'onResize'> & {
  /** The controlled size of the element, in CSS pixels. */
  size?: ResizableSize;
  /** The initial size of the element when uncontrolled, in CSS pixels. */
  defaultSize?: ResizableSize;
  /** The minimum allowed size. Omitted dimensions default to zero. */
  minSize?: ResizableSizeConstraints;
  /** The maximum allowed size. Omitted dimensions have no upper limit. */
  maxSize?: ResizableSizeConstraints;
  /** Whether resizing is disabled. */
  isDisabled?: boolean;
  /** Handler called whenever the size changes. */
  onResize?: (size: ResizableSize) => void;
  /** Handler called when a resize interaction starts. */
  onResizeStart?: (size: ResizableSize) => void;
  /** Handler called when a resize interaction ends. */
  onResizeEnd?: (size: ResizableSize) => void;
};

export type ResizableHandleProps = ComponentPropsWithRef<'div'> & {
  /**
   * Physical resize direction: `-1` means left/up, `0` disables the axis,
   * and `1` means right/down.
   */
  direction: ResizableHandleDirection;
};
