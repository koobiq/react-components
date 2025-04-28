import type { ComponentPropsWithRef, ReactNode } from 'react';

import type { IconButtonProps } from '../IconButton';

export const alertPropStatus = ['info', 'warning', 'error', 'success'] as const;

export type AlertPropStatus = (typeof alertPropStatus)[number];

export type AlertBaseProps = {
  /**
   * The status of the component.
   * @default info
   * */
  status?: AlertPropStatus;
  /**
   * If `true`, compact mode will be enabled in the alert.
   * @default false
   */
  compact?: boolean;
  /**
   * If `true`, background color will be enabled in the alert.
   * @default false
   */
  colored?: boolean;
  /** Additional CSS-classes. */
  className?: string;
  /**
   * If `true`, the status icon will be hidden in the component.
   * @default false
   */
  hideIcon?: boolean;
  /** Title content. */
  title?: ReactNode;
  /** Message of the alert. */
  children?: ReactNode;
  /** Action element, such as a button or link. */
  action?: ReactNode;
  /** Override default icon. */
  icon?: ReactNode;
  /** A callback function called when the user clicks the alert's close button. */
  onClose?: IconButtonProps['onPress'];
  slotProps?: {
    content?: ComponentPropsWithRef<'div'>;
    statusIcon?: ComponentPropsWithRef<'div'>;
    closeIcon?: IconButtonProps;
  };
};
