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

export const descriptionListPropAlign = [
  'start',
  'center',
  'end',
  'stretch',
] as const;

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
   * Columns of the horizontal layout, as CSS `grid-template-columns`.
   * The term takes the first column, the description takes the rest:
   * `'repeat(2, 1fr)'`, `'200px 1fr'`, `'auto 1fr'`.
   * Can be set per breakpoint: `{ m: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' }`.
   * @default 'repeat(4, 1fr)'
   */
  columns?: string | ResponsiveValue<string>;
  /**
   * Vertical alignment of terms and descriptions.
   * Can be set per breakpoint: `{ xs: 'start', m: 'center' }`.
   * @default 'stretch'
   */
  alignItems?:
    DescriptionListPropAlign | ResponsiveValue<DescriptionListPropAlign>;
  /**
   * Horizontal alignment of terms and descriptions.
   * Can be set per breakpoint: `{ xs: 'start', m: 'center' }`.
   * @default 'stretch'
   */
  justifyItems?:
    DescriptionListPropAlign | ResponsiveValue<DescriptionListPropAlign>;
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

export type DescriptionListTermProps = ExtendableProps<
  {
    /** Additional CSS-classes. */
    className?: string;
    /** The term, e.g. a field name. */
    children?: ReactNode;
  } & DataAttributeProps,
  ComponentPropsWithRef<'dt'>
>;

export type DescriptionListDescriptionProps = ExtendableProps<
  {
    /** Additional CSS-classes. */
    className?: string;
    /** The description of the term, e.g. a field value. */
    children?: ReactNode;
  } & DataAttributeProps,
  ComponentPropsWithRef<'dd'>
>;

export type DescriptionListComponent = <T extends object = object>(
  props: DescriptionListProps<T>
) => ReactElement | null;
