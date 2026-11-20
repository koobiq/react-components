import { createContext, useContext } from 'react';
import type { KeyboardEvent } from 'react';

import type { MoveMoveEvent } from '@koobiq/react-core';

import type { SplitterSeparatorValues } from './model';
import type { SplitterPropOrientation } from './types';

/** What a panel reads from the splitter that renders it. */
export type SplitterPanelContextValue = {
  index: number;
  isLast: boolean;
  isCollapsed: boolean;
  isDisabled: boolean;
  /** Whether the separator of this panel is being dragged. */
  isResizing: boolean;
  orientation: SplitterPropOrientation;
  separatorCursor: string;
  separatorValues: SplitterSeparatorValues;
  onResizeStart: () => void;
  onResize: (event: MoveMoveEvent) => void;
  onResizeEnd: () => void;
  /** Drops a drag that can no longer end on its own. */
  onResizeCancel: () => void;
  onSeparatorKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  onSeparatorDoubleClick: () => void;
};

export const SplitterPanelContext =
  createContext<SplitterPanelContextValue | null>(null);

export const useSplitterPanelContext = () => useContext(SplitterPanelContext);
