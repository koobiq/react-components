import type { CSSProperties, ReactNode } from 'react';

import type { ResponsiveValue } from '../../utils';

export const gridPropGap = [
  0,
  '3xs',
  'xxs',
  'xs',
  's',
  'm',
  'l',
  'xl',
  'xxl',
  '3xl',
  '4xl',
  '5xl',
  '6xl',
  '7xl',
] as const;
export type GridPropGap = (typeof gridPropGap)[number];

export type GridBaseProps = {
  /** Number of columns. */
  cols?: number | ResponsiveValue<number>;
  /** Size of gaps between columns and rows. */
  gap?: GridPropGap | ResponsiveValue<GridPropGap>;
  /** Size of gaps between columns. */
  colGap?: GridPropGap | ResponsiveValue<GridPropGap>;
  /** Size of gaps between rows. */
  rowGap?: GridPropGap | ResponsiveValue<GridPropGap>;
  /**
   * Control item alignment on the horizontal axis.
   * Defines the default `justifySelf` for all items in the grid.
   * */
  justifyItems?:
    | CSSProperties['justifyItems']
    | ResponsiveValue<CSSProperties['justifyItems']>;
  /**
   * Control item alignment on the vertical axis.
   * Defines the default `alignSelf` for all items in the grid.
   * */
  alignItems?:
    | CSSProperties['alignItems']
    | ResponsiveValue<CSSProperties['alignItems']>;
  /** Additional CSS-classes. */
  className?: string;
  /** The content of the component. */
  children?: ReactNode;
  /** Inline styles. */
  style?: CSSProperties;
};
