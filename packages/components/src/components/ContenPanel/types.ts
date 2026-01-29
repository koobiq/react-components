import type {
  ComponentPropsWithRef,
  ComponentRef,
  CSSProperties,
  ReactNode,
} from 'react';

import type { TransitionProps } from 'react-transition-group/Transition';

import type { DialogProps } from '../Dialog';

export type ContentPanelSize = number;

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
  /** If `true`, the panel can be resized by the user. */
  isResizable?: boolean;
  /** Handler that is called whenever the panel width changes. */
  onResize?: (width: number) => void;
  /** Handler that is called when the user starts resizing the panel. */
  onResizeStart?: () => void;
  /** Handler that is called when the user finishes resizing the panel. */
  onResizeEnd?: (width: number) => void;
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
    resizer?: ComponentPropsWithRef<'div'>;
  };
} & Pick<DialogProps, 'hideCloseButton'>;

export type ContentPanelRef = ComponentRef<'div'>;
