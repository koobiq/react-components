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
  'inlineBlock',
] as const;
export type TypographyDisplayVariant = (typeof typographyPropDisplay)[number];

export const typographyPropAlign = [
  'start',
  'center',
  'end',
  'initial',
  'inherit',
] as const;
export type TypographyPropAlign = (typeof typographyPropAlign)[number];

export type TypographyBaseProps = {
  /** The variant to use. */
  variant?: TypographyPropVariant;
  display?: TypographyDisplayVariant;
  align?: TypographyPropAlign;
  ellipsis?: boolean;
  /** The content of the component. */
  children?: ReactNode;
  /** Additional CSS-classes. */
  className?: string;
};