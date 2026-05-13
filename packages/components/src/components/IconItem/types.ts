import type { ReactNode } from 'react';

export const iconItemPropColor = [
  'theme',
  'contrast',
  'warning',
  'error',
  'success',
] as const;

export const iconItemPropVariant = ['solid', 'fade'] as const;

export const iconItemPropSize = ['normal', 'big'] as const;

export type IconItemPropColor = (typeof iconItemPropColor)[number];
export type IconItemPropVariant = (typeof iconItemPropVariant)[number];
export type IconItemPropSize = (typeof iconItemPropSize)[number];

export type IconItemBaseProps = {
  /**
   * The variant to use.
   * @default 'solid'
   */
  variant?: IconItemPropVariant;
  /**
   * The size of the component.
   * @default 'normal'
   */
  size?: IconItemPropSize;
  /**
   * The color of the icon item.
   * @default 'theme'
   */
  color?: IconItemPropColor;
  /** The content of the component. */
  children?: ReactNode;
  /** Additional CSS-classes. */
  className?: string;
};
