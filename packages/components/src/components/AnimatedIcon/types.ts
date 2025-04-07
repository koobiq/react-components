import type { ComponentRef, CSSProperties, ReactNode } from 'react';

export type AnimatedIconBaseProps = {
  /** A list of icons. */
  icons?: ReactNode[];
  /** A list of directions for the icons. */
  directions?: number[];
  /**
   * Animation duration in milliseconds.
   * @default 300
   * */
  transition?: number;
  /** Index of the active icon. */
  activeIndex?: number;
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
};

export type AnimatedIconRef = ComponentRef<'span'>;
