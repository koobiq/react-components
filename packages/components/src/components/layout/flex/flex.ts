import { clsx } from '@koobiq/react-core';

import s from './flex.module.css';

export const flexPropAlignItems = [
  'flex-start',
  'flex-end',
  'center',
  'baseline',
  'stretch',
] as const;
export type FlexPropAlignItems = (typeof flexPropAlignItems)[number];

export const flexPropGap = [
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
  '5l',
  '6xl',
  '7xl',
] as const;
export type FlexPropGap = (typeof flexPropGap)[number];

export const flexPropJustifyContent = [
  'flex-start',
  'flex-end',
  'center',
  'space-between',
  'space-around',
  'space-evenly',
] as const;
export type FlexPropJustifyContent = (typeof flexPropJustifyContent)[number];

export const flexPropFlex = ['flex', 'inline-flex'] as const;
export type FlexPropFlex = (typeof flexPropFlex)[number];

export const flexPropWrap = ['nowrap', 'wrap', 'wrap-reverse'] as const;
export type FlexPropWrap = (typeof flexPropWrap)[number];

export const flexPropDirection = [
  'row',
  'row-reverse',
  'column',
  'column-reverse',
] as const;
export type FlexPropDirection = (typeof flexPropDirection)[number];

export const flexPropOrder = [-1, 0, 1] as const;
export type FlexPropOrder = (typeof flexPropOrder)[number];

export type FlexProps = {
  /** Defines the `gap` property. */
  gap?: FlexPropGap;
  /** Defines the `column-gap` property. */
  colGap?: FlexPropGap;
  /** Defines the `row-gap` property. */
  rowGap?: FlexPropGap;
  /** Defines the `display` property with `flex` or `inline-flex` value. */
  flex?: FlexPropFlex;
  /** Defines the `flex-wrap` property. */
  wrap?: FlexPropWrap;
  /** Defines the `order` property. */
  order?: FlexPropOrder;
  /** Defines the `flex-direction` property. */
  direction?: FlexPropDirection;
  /** Defines the `align-items` property. */
  alignItems?: FlexPropAlignItems;
  /** Defines the `justify-content` property. */
  justifyContent?: FlexPropJustifyContent;
};

export type FlexParams = (props: FlexProps, className?: string) => string;

export const flex: FlexParams = (props, className) => {
  const {
    alignItems,
    justifyContent,
    flex,
    wrap,
    direction,
    gap,
    rowGap: rowGapProp,
    colGap: colGapProp,
    order: orderProp,
  } = props;

  const order = String(orderProp);

  const colGap = colGapProp ?? gap;
  const rowGap = rowGapProp ?? gap;

  return clsx(
    s.base,
    flex && s[`flex_${flex}`],
    wrap && s[`wrap_${wrap}`],
    order && s[`order_${order}`],
    rowGap && s[`gap_row_${rowGap}`],
    colGap && s[`gap_column_${colGap}`],
    direction && s[`direction_${direction}`],
    alignItems && s[`alignItems_${alignItems}`],
    justifyContent && s[`justifyContent_${justifyContent}`],
    className
  );
};
