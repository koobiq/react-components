import type {
  ComponentPropsWithRef,
  CSSProperties,
  ElementType,
  ReactNode,
} from 'react';

import type { IconButtonProps } from '../IconButton';

export const tagPropVariant = [
  'theme-fade',
  'contrast-fade',
  'error-fade',
  'warning-fade',
] as const;

export type TagPropVariant = (typeof tagPropVariant)[number];

export type TagRemoveButtonProps = IconButtonProps<ElementType>;

export type TagSlotProps = {
  root?: ComponentPropsWithRef<'div'>;
  body?: ComponentPropsWithRef<'div'>;
  icon?: ComponentPropsWithRef<'span'>;
  content?: ComponentPropsWithRef<'span'>;
  removeIcon?: TagRemoveButtonProps;
};

export type TagProps = Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  /**
   * The variant to use.
   * @default 'theme-fade'
   */
  variant?: TagPropVariant;
  /** Icon placed before the children. */
  icon?: ReactNode;
  /** The props used for each slot inside. */
  slotProps?: TagSlotProps;
  /** Whether the tag is disabled. */
  isDisabled?: boolean;
  /** Inline styles. */
  style?: CSSProperties;
  /** Rendered contents of the tag. */
  children?: ReactNode;
};
