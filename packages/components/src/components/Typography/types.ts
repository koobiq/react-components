import type { ReactNode } from 'react';

export const typographyPropVariant = [
  'display-big',
  'display-normal',
  'display-compact',
  'display-big-strong',
  'display-normal-strong',
  'display-compact-strong',
  'headline',
  'title',
  'subheading',
  'text-big',
  'text-big-strong',
  'text-big-medium',
  'text-normal',
  'text-normal-strong',
  'text-normal-medium',
  'text-compact',
  'text-compact-strong',
  'text-compact-medium',
  'caps-big',
  'caps-big-strong',
  'caps-normal',
  'caps-normal-strong',
  'caps-compact',
  'caps-compact-strong',
  'mono-big',
  'mono-big-strong',
  'mono-normal',
  'mono-normal-strong',
  'mono-compact',
  'mono-compact-strong',
  'mono-codeblock',
  'tabular-big',
  'tabular-big-strong',
  'tabular-normal',
  'tabular-normal-strong',
  'tabular-compact',
  'tabular-compact-strong',
  'italic-big',
  'italic-big-strong',
  'italic-normal',
  'italic-normal-strong',
  'italic-compact',
  'italic-compact-strong',
  'inherit',
] as const;

export type TypographyPropVariant = (typeof typographyPropVariant)[number];

export const typographyPropDisplay = [
  'block',
  'inline',
  'inline-block',
] as const;

/**
 * @deprecated
 * This type has been deprecated, please use `TypographyPropDisplay` instead.
 */
export type TypographyDisplayVariant = (typeof typographyPropDisplay)[number];

export type TypographyPropDisplay = (typeof typographyPropDisplay)[number];

export const typographyPropAlign = [
  'start',
  'center',
  'end',
  'initial',
  'inherit',
] as const;
export type TypographyPropAlign = (typeof typographyPropAlign)[number];

export const typographyPropColor = [
  'white',
  'white-secondary',
  'theme',
  'theme-secondary',
  'contrast',
  'on-contrast',
  'contrast-secondary',
  'contrast-tertiary',
  'error',
  'error-secondary',
  'error-tertiary',
  'error-less',
  'success',
  'success-less',
  'success-secondary',
  'warning',
  'warning-secondary',
  'visited',
  'inherit',
] as const;
export type TypographyPropColor = (typeof typographyPropColor)[number];

export type TypographyBaseProps = {
  /**
   * The variant to use.
   * @default 'text-normal'
   */
  variant?: TypographyPropVariant;
  /** Set the display for the component. */
  display?: TypographyPropDisplay;
  /** Set the text-align on the component. */
  align?: TypographyPropAlign;
  /** Hidden overflow content will be replaced by an ellipsis. */
  ellipsis?: boolean;
  /** The content of the component. */
  children?: ReactNode;
  /** Additional CSS-classes. */
  className?: string;
  /**
   * Text color.
   * @default 'contrast'
   */
  color?: TypographyPropColor;
};
