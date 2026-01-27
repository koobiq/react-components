import type { ComponentRef, ReactNode } from 'react';

import type { TransitionProps } from 'react-transition-group/Transition';

import type { DialogProps } from '../Dialog';

export type ContentPanelSize = number;

export type ContentPanelProps = {
  children?: ReactNode;
  /** The width of the panel. */
  width?: ContentPanelSize | null;
  /** The minimum width of the panel. */
  minWidth?: ContentPanelSize | null;
  /** The maximum width of the panel. */
  maxWidth?: ContentPanelSize | null;
  /** The default width of the panel. */
  defaultWidth?: ContentPanelSize | null;
  isResizable?: boolean;
  onResize?: (width: number) => void;
  onResizeStart?: () => void;
  onResizeEnd?: (width: number) => void;
  isOpen?: boolean;
  defaultOpen?: boolean;
  /** Handler that is called when the panel's open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** The props used for each slot inside. */
  slotProps?: {
    transition?: Partial<TransitionProps<HTMLElement>>;
  };
} & Omit<DialogProps, 'slotProps'>;

export type ContentPanelRef = ComponentRef<'div'>;
