import type { ComponentRef, CSSProperties, ReactNode } from 'react';

export type SkeletonBlockBaseProps = {
  /** The content of the component. */
  children?: ReactNode;
  /** Additional CSS-classes. */
  className?: string;
  /** Width of component. */
  inlineSize?: CSSProperties['inlineSize'];
  /** Height of components. */
  blockSize?: CSSProperties['blockSize'];
  /** Wave color. */
  waveColor?: string;
  /** Background color. */
  bgColor?: string;
  /** Inline styles. */
  style?: CSSProperties;
};

export type SkeletonBlockRef = ComponentRef<'span'>;
