import type { CSSProperties, ReactNode } from 'react';

import type { ResponsiveValue } from '../../utils';

export const containerMarginsProp = [
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

export type ContainerMarginsProp = (typeof containerMarginsProp)[number];

export type ContainerMaxInlineSizeProp = CSSProperties['maxInlineSize'];

export const containerPositionProp = ['start', 'center', 'end'] as const;
export type ContainerPositionProp = (typeof containerPositionProp)[number];

type ContainerDeprecatedProps = {
  /**
   * If `true`, doesn't set the max-inline-size of the container.
   * @default false
   * @deprecated
   * The "fixed" prop is deprecated. Use "isFixed" prop to replace it.
   */
  fixed?: boolean;
};

export type ContainerBaseProps = {
  /**
   * Container position.
   * @default 'center'
   */
  position?: ContainerPositionProp | ResponsiveValue<ContainerPositionProp>;
  /** Determine the max-inline-size of the container. */
  maxInlineSize?:
    | ContainerMaxInlineSizeProp
    | ResponsiveValue<ContainerMaxInlineSizeProp>;
  /**
   * Margins are the space between content and the left and right edges of the screen.
   * @default 0
   */
  margins?: ContainerMarginsProp | ResponsiveValue<ContainerMarginsProp>;
  /**
   * If `true`, doesn't set the max-inline-size of the container.
   * @default false
   */
  isFixed?: boolean;
  /** The content of the component. */
  children?: ReactNode;
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
} & ContainerDeprecatedProps;
