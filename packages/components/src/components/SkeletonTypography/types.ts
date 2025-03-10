import type { ComponentRef, CSSProperties } from 'react';

import type { TypographyPropVariant } from '../Typography';

export type SkeletonTypographyPropVariant = TypographyPropVariant;

export type SkeletonTypographyBaseProps = {
  /**
   * Variant of typography.
   * @default text-normal
   * */
  variant?: SkeletonTypographyPropVariant;
  /** Number of lines per paragraph. */
  rows?: number;
  /** The content of the component. */
  children?: never;
  /** Additional CSS-classes. */
  className?: string;
  /** Width of component. */
  inlineSize?: CSSProperties['inlineSize'];
  /** Wave color. */
  waveColor?: string;
  /** Background color. */
  bgColor?: string;
  /** Inline styles. */
  style?: CSSProperties;
};

export type SkeletonTypographyRef = ComponentRef<'span'>;
