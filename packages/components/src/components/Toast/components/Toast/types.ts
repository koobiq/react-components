import type {
  ComponentPropsWithRef,
  CSSProperties,
  ReactNode,
  Ref,
} from 'react';

import type { DataAttributeProps } from '@koobiq/react-core';
import type {
  ToastState,
  QueuedToast,
  AriaToastProps,
} from '@koobiq/react-primitives';

import type { IconButtonProps } from '../../../IconButton';
import type { ToastPropStatus } from '../../index';

export type ToastContentProps = {
  /** Title of the toast. */
  title?: ReactNode;
  /** Action element, such as a button or link. */
  action?: ReactNode;
  /** Description of the toast. */
  caption?: ReactNode;
  /**
   * The status of the toast.
   * @default 'info'
   */
  status?: ToastPropStatus;
  ref?: Ref<HTMLDivElement>;
  /** Other toast's props. */
  props?: ComponentPropsWithRef<'div'> & {
    /** If `true`, the close button will be hidden in the component. */
    hideCloseButton?: boolean;
    /** If `true`, the status icon will be hidden in the component. */
    hideIcon?: boolean;
    /** Override default icon. */
    icon?: ReactNode;
    /** The props used for each slot inside. */
    slotProps?: {
      content?: ComponentPropsWithRef<'div'>;
      statusIcon?: ComponentPropsWithRef<'div'>;
      closeIcon?: IconButtonProps;
    };
  };
};

export type ToastProps = AriaToastProps<ToastContentProps> & {
  state: ToastState<ToastContentProps>;
  toast: QueuedToast<ToastContentProps>;
  innerRef: Ref<HTMLDivElement>;
  style?: CSSProperties;
} & DataAttributeProps;
