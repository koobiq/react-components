import type {
  ComponentPropsWithRef,
  ComponentRef,
  ReactElement,
  ReactNode,
} from 'react';

import type { ButtonOptions } from '@koobiq/react-primitives';

import type { BackdropProps } from '../Backdrop';
import type { DialogProps } from '../Dialog';

export const sidePanelPropSize = ['small', 'medium', 'large'] as const;

export type SidePanelPropSize = (typeof sidePanelPropSize)[number];

export const sidePanelPropPosition = ['left', 'right'] as const;

export type SidePanelPropPosition = (typeof sidePanelPropPosition)[number];

export type SidePanelPropContent =
  | ReactNode
  | ((props: { close(): void }) => ReactElement);

export type SidePanelPropControl = (props: ButtonOptions) => ReactElement;

type SidePanelDeprecatedProps = {
  /**
   * If `true`, the component is shown.
   *
   * @deprecated
   * The "open" prop is deprecated. Use "isOpen" prop to replace it.
   */
  open?: boolean;
};

export type SidePanelProps = {
  /**
   * Component width size.
   * @default medium
   */
  size?: SidePanelPropSize;
  /**
   * Side from which the side panel will appear.
   * @default left
   */
  position?: SidePanelPropPosition;
  /** If `true`, the component is shown. */
  isOpen?: boolean;
  /** The default open state. Use when the component is not controlled. */
  defaultOpen?: boolean;
  /** The content of the component. */
  children?: SidePanelPropContent;
  /** The render function of the control for displaying the modal window. */
  control?: SidePanelPropControl;
  /**
   * If `true`, the close button isn't shown.
   * @default false
   */
  hideCloseButton?: boolean;
  /** Handler that is called when the modal's open state changes. */
  onOpenChange?: (open: boolean) => void;
  /**
   * The container element in which the component portal will be placed.
   * @default document.body
   */
  portalContainer?: Element;
  /**
   * If `true`, the modal window won't close when clicked outside of it.
   * @default false
   */
  disableExitOnClickOutside?: boolean;
  /**
   * If `true`, the modal window won't close when the ESC key is pressed.
   * @default false
   */
  disableExitOnEscapeKeyDown?: boolean;
  /**
   * If `true`, the underlay (backdrop) under the modal window isn't shown.
   * @default false
   */
  hideBackdrop?: boolean;
  /** Additional CSS-classes. */
  className?: string;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
  /**
   * If `true`, the focus trap in modal window is disabled.
   * @default false
   */
  disableFocusManagement?: boolean;
  /**
   * When user interacts with the argument element outside of the overlay ref,
   * return true if onClose should be called. This gives you a chance to filter
   * out interaction with elements that should not dismiss the overlay.
   * By default, onClose will always be called on interaction outside the overlay ref.
   */
  shouldCloseOnInteractOutside?: (element: Element) => boolean;
  /** The props used for each slot inside. */
  slotProps?: {
    dialog?: DialogProps;
    backdrop?: BackdropProps;
    panel?: ComponentPropsWithRef<'div'>;
  };
} & SidePanelDeprecatedProps;

export type SidePanelRef = ComponentRef<'div'>;
