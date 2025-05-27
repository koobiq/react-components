import type { ReactNode } from 'react';

import type { IconButtonProps } from '../IconButton';

export const tagPropVariant = [
  'theme-fade',
  'contrast-fade',
  'error-fade',
  'warning-fade',
] as const;

export type TagPropVariant = (typeof tagPropVariant)[number];

export type TagBaseProps = {
  /** The label of the component. */
  label?: ReactNode;
  /** Icon placed before the children. */
  icon?: ReactNode;
  /**
   * The variant to use.
   * @default theme-fade
   * */
  variant?: TagPropVariant;
  /**
   * If `true`, the component is disabled.
   * @default false
   * */
  isDisabled?: boolean;
  /** A callback function called when the user clicks the tag's close button. */
  onClose?: IconButtonProps['onPress'];
  children?: never;
};
