import type { ComponentPropsWithRef, ReactElement, ReactNode } from 'react';

import type {
  DataAttributeProps,
  ExtendableProps,
  Key,
} from '@koobiq/react-core';

import type { ResponsiveValue } from '../../utils';

export const descriptionListPropOrientation = [
  'horizontal',
  'vertical',
] as const;

export type DescriptionListPropOrientation =
  (typeof descriptionListPropOrientation)[number];

export const descriptionListPropAlign = ['start', 'center', 'end'] as const;

export type DescriptionListPropAlign =
  (typeof descriptionListPropAlign)[number];

export type DescriptionListBaseProps<T extends object = object> = {
  /**
   * Whether descriptions go next to terms (`horizontal`) or under them (`vertical`).
   * Can be set per breakpoint: `{ xs: 'vertical', m: 'horizontal' }`.
   * @default 'horizontal'
   */
  orientation?:
    | DescriptionListPropOrientation
    | ResponsiveValue<DescriptionListPropOrientation>;
  /**
   * Width of the term column in the horizontal layout:
   * `200` (px), `'50%'`, `'auto'` or `'minmax(120px, 30%)'`.
   * @default '25%'
   */
  termWidth?: string | number;
  /**
   * Vertical alignment of terms and descriptions.
   * @default 'start'
   */
  alignItems?: DescriptionListPropAlign;
  /**
   * Horizontal alignment of terms and descriptions.
   * @default 'start'
   */
  justifyItems?: DescriptionListPropAlign;
  /** Data to render with the `children` function. Each item needs an `id` or `key`. */
  items?: Iterable<T>;
  /**
   * Values the `children` function uses besides the item, e.g. `[locale]`.
   * Groups re-render when they change.
   */
  dependencies?: ReadonlyArray<unknown>;
  /** `DescriptionList.Group` elements, or a function that renders a group for an item of `items`. */
  children?: ReactNode | ((item: T) => ReactNode);
  /** Additional CSS-classes. */
  className?: string;
} & DataAttributeProps;

export type DescriptionListProps<T extends object = object> = ExtendableProps<
  DescriptionListBaseProps<T>,
  ComponentPropsWithRef<'dl'>
>;

export type DescriptionListGroupProps = ExtendableProps<
  {
    /** Unique id of the group. With `items`, taken from `id` or `key` of the item. */
    id?: Key;
  } & DataAttributeProps,
  ComponentPropsWithRef<'div'>
>;

export type DescriptionListTermProps = ComponentPropsWithRef<'dt'> &
  DataAttributeProps;

export type DescriptionListDescriptionProps = ComponentPropsWithRef<'dd'> &
  DataAttributeProps;

export type DescriptionListComponent = <T extends object = object>(
  props: DescriptionListProps<T>
) => ReactElement | null;
