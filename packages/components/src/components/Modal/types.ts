import type {
  ComponentPropsWithRef,
  ComponentRef,
  ReactElement,
  ReactNode,
} from 'react';

import type { ButtonOptions } from '@koobiq/react-primitives';

import type { BackdropProps } from '../Backdrop';
import type { DialogProps } from '../Dialog';

export const modalPropSize = ['small', 'medium', 'large'] as const;

export type ModalPropSize = (typeof modalPropSize)[number];

export type ModalPropContent =
  | ReactNode
  | ((props: { close(): void }) => ReactElement);

export type ModalPropControl = (props: ButtonOptions) => ReactElement;

type ModalDeprecatedProps = {
  /**
   * If `true`, the component is shown.
   *
   * @deprecated
   * The "open" prop is deprecated. Use "isOpen" prop to replace it.
   */
  open?: boolean;
};

export type ModalProps = {
  /**
   * Component width size.
   * @default medium
   */
  size?: ModalPropSize;
  /** If `true`, the component is shown. */
  isOpen?: boolean;
  /** The default open state. Use when the component is not controlled. */
  defaultOpen?: boolean;
  /** The content of the component. */
  children?: ModalPropContent;
  /** The render function of the control for displaying the modal window. */
  control?: ModalPropControl;
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
    modal?: ComponentPropsWithRef<'div'>;
  };
} & ModalDeprecatedProps;

export type ModalRef = ComponentRef<'div'>;
