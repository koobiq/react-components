import type { ComponentPropsWithRef, ComponentRef, ReactNode } from 'react';

import type {
  DataAttributeProps,
  ExtendableComponentPropsWithRef,
} from '@koobiq/react-core';
import type { AriaDialogProps } from '@koobiq/react-primitives';

import type { DialogCloseButtonProps } from './components';

export type DialogBaseProps = {
  /** The content of the component. */
  children?: ReactNode;
  /** Additional CSS-classes. */
  className?: string;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
  /** A callback function called when the user clicks the dialog's close button. */
  onClose?(): void;
  /**
   * If `true`, the close button isn't shown.
   */
  hideCloseButton?: boolean;
  /** The props used for each slot inside. */
  slotProps?: {
    container?: ComponentPropsWithRef<'div'> & DataAttributeProps;
    'close-button'?: DialogCloseButtonProps;
  };
} & AriaDialogProps;

export type DialogProps = ExtendableComponentPropsWithRef<
  DialogBaseProps,
  'section'
>;

export type DialogRef = ComponentRef<'section'>;
