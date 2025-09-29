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

export const containerPlacementProp = ['start', 'center', 'end'] as const;
export type ContainerPlacementProp = (typeof containerPlacementProp)[number];

/**
 * @deprecated
 */
export const containerPositionProp = containerPlacementProp;
/**
 * @deprecated
 */
export type ContainerPositionProp = ContainerPlacementProp;

type ContainerDeprecatedProps = {
  /**
   * If `true`, doesn't set the max-inline-size of the container.
   * @deprecated
   * The "fixed" prop is deprecated. Use "isFixed" prop to replace it.
   */
  fixed?: boolean;
  /**
   * Container position.
   * @default 'center'
   * @deprecated
   * The "position" prop is deprecated. Use "placement" prop to replace it.
   */
  position?: ContainerPositionProp | ResponsiveValue<ContainerPositionProp>;
};

export type ContainerBaseProps = {
  /**
   * Container placement.
   * @default 'center'
   */
  placement?: ContainerPlacementProp | ResponsiveValue<ContainerPlacementProp>;
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
   */
  isFixed?: boolean;
  /** The content of the component. */
  children?: ReactNode;
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
} & ContainerDeprecatedProps;
