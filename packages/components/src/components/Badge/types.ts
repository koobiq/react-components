import type { ReactNode } from 'react';

export const badgePropSize = ['compact', 'normal'] as const;

export type BadgePropSize = (typeof badgePropSize)[number];

export const badgePropVariant = [
  'theme',
  'fade-theme',
  'outline-fade-theme',
  'error',
  'fade-error',
  'outline-fade-error',
  'warning',
  'fade-warning',
  'outline-fade-warning',
  'success',
  'fade-success',
  'outline-fade-success',
  'contrast',
  'fade-contrast',
  'outline-fade-contrast',
] as const;

export type BadgePropVariant = (typeof badgePropVariant)[number];

type BadgeDeprecatedProps = {
  /**
   * The label of the component.
   * @deprecated
   * The "label" prop is deprecated. Use "children" prop to replace it.
   */
  label?: ReactNode;
};

export type BadgeBaseProps = {
  /** The variant to use. */
  variant?: BadgePropVariant;
  /** The size of the component. */
  size?: BadgePropSize;
  /** The content of the component. */
  children?: ReactNode;
  /** Icon placed before the children. */
  startIcon?: ReactNode;
  /** Icon placed after the children. */
  endIcon?: ReactNode;
  /** Additional CSS-classes. */
  className?: string;
} & BadgeDeprecatedProps;
