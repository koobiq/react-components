import type { ReactNode, ReactElement } from 'react';

import type { ButtonOptions } from '@koobiq/react-primitives';

import type { BackdropProps } from '../Backdrop';
import type { DialogProps } from '../Dialog';

export type ModalTriggerPropContent =
  | ReactNode
  | ((props: { close(): void }) => ReactElement);
export type ModalTriggerPropControl = (props: ButtonOptions) => ReactElement;

export type ModalTriggerProps = {
  /** If `true`, the component is shown. */
  open?: boolean;
  /** The default open state. Use when the component is not controlled. */
  defaultOpen?: boolean;
  /** The content of the component. */
  children?: ModalTriggerPropContent;
  /** The render function of the control for displaying the modal window. */
  control?: ModalTriggerPropControl;
  /**
   * If `true`, the close button isn't shown.
   * @default false
   * */
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
  /** The props used for each slot inside. */
  slotProps?: {
    dialog?: DialogProps;
    backdrop?: BackdropProps;
  };
};
