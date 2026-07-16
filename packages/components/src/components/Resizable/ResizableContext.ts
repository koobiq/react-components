import { createContext, useContext } from 'react';

import type { ResizableHandleDirection, ResizableSize } from './types';
import type { ResizableBounds } from './utils';

export type ResizableMoveEvent = {
  deltaX: number;
  deltaY: number;
  pointerType: string;
  shiftKey: boolean;
};

export type ResizableContextValue = {
  rootId: string;
  size: ResizableSize;
  bounds: ResizableBounds;
  isDisabled: boolean;
  activeDirection: string | null;
  onMoveStart: (direction: ResizableHandleDirection) => void;
  onMove: (event: ResizableMoveEvent) => void;
  onMoveEnd: () => void;
};

export const ResizableContext = createContext<ResizableContextValue | null>(
  null
);

export const useResizableContext = () => {
  const context = useContext(ResizableContext);

  if (!context) {
    throw new Error('Resizable.Handle must be rendered inside Resizable.');
  }

  return context;
};
