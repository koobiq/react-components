import type {
  ComponentPropsWithRef,
  ComponentRef,
  CSSProperties,
  ReactNode,
} from 'react';

import type { DataAttributeProps } from '@koobiq/react-core';
import type { TransitionProps } from 'react-transition-group/Transition';

import type { DialogProps } from '../Dialog';

export type ContentPanelSize = number | `${number}` | `${number}%`;

export type ContentPanelProps = {
  /** The content of the panel. */
  children?: ReactNode;
  /** The width of the panel. */
  width?: ContentPanelSize | null;
  /** The minimum width of the panel. */
  minWidth?: ContentPanelSize | null;
  /** The maximum width of the panel. */
  maxWidth?: ContentPanelSize | null;
  /** The default width of the panel. */
  defaultWidth?: ContentPanelSize | null;
  /**
   * If `true`, the panel can be resized by the user.
   * @default false
   */
  isResizable?: boolean;
  /** Handler that is called whenever the panel width changes. */
  onResize?: (width: number) => void;
  /** Handler that is called when the user starts resizing the panel. */
  onResizeStart?: (width: number) => void;
  /** Handler that is called when the user finishes resizing the panel. */
  onResizeEnd?: (width: number) => void;
  /**
   * Handler that is called when the panel width is reset (double-click on the resizer).
   * Receives the initial width and can return a new width.
   * If nothing is returned, the panel resets to the initial width.
   */
  onResetResize?: (initialWidth: number) => number | null | undefined;
  /** If `true`, the panel is shown. */
  isOpen?: boolean;
  /** The default open state. Use when the component is not controlled. */
  defaultOpen?: boolean;
  /** Handler that is called when the panel's open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** The props used for each slot inside. */
  slotProps?: {
    dialog?: DialogProps;
    transition?: Partial<TransitionProps<HTMLElement>>;
    resizer?: ComponentPropsWithRef<'div'> & DataAttributeProps;
  };
  /** If `true`, the content panel won't close when the ESC key is pressed. */
  disableExitOnEscapeKeyDown?: boolean;
} & Pick<DialogProps, 'hideCloseButton'>;

export type ContentPanelRef = ComponentRef<'div'>;
