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

export type ResizableBounds = {
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
};

export type ResizableMoveEvent = {
  deltaX: number;
  deltaY: number;
  pointerType: string;
  shiftKey: boolean;
};
