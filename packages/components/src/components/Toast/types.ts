import type {
  ComponentPropsWithRef,
  CSSProperties,
  ReactElement,
  ReactNode,
} from 'react';

import type { IconButtonProps } from '../IconButton';

export const toastPropStatus = ['info', 'warning', 'error', 'success'] as const;

export type ToastPropStatus = (typeof toastPropStatus)[number];

export type ToastProps = {
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

export const toastPlacement = [
  'bottom',
  'bottom-start',
  'bottom-end',
  'top',
  'top-start',
  'top-end',
] as const;

export type ToastPlacement = (typeof toastPlacement)[number];

export type ToastProviderProps = {
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** The maximum number of toasts to display at a time. */
  maxVisibleToasts?: number;
  placement?: ToastPlacement;
};

export type ToastProviderComponent = (
  props: ToastProviderProps
) => ReactElement | null;
