import type { ComponentPropsWithRef, ReactElement, ReactNode } from 'react';

import type { DataAttributeProps, ExtendableProps } from '@koobiq/react-core';

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
  /** Data to render with the `children` function. Each item should have an `id` or `key`. */
  items?: Iterable<T>;
  /** Terms and descriptions, or a function that renders one item of `items`. */
  children?: ReactNode | ((item: T) => ReactNode);
  /** Additional CSS-classes. */
  className?: string;
} & DataAttributeProps;

export type DescriptionListProps<T extends object = object> = ExtendableProps<
  DescriptionListBaseProps<T>,
  ComponentPropsWithRef<'dl'>
>;

export type DescriptionListGroupProps = ComponentPropsWithRef<'div'> &
  DataAttributeProps;

export type DescriptionListTermProps = ComponentPropsWithRef<'dt'> &
  DataAttributeProps;

export type DescriptionListDescriptionProps = ComponentPropsWithRef<'dd'> &
  DataAttributeProps;

export type DescriptionListComponent = <T extends object = object>(
  props: DescriptionListProps<T>
) => ReactElement | null;

export type DescriptionListGroupComponent = (
  props: DescriptionListGroupProps
) => ReactElement | null;

export type DescriptionListTermComponent = (
  props: DescriptionListTermProps
) => ReactElement | null;

export type DescriptionListDescriptionComponent = (
  props: DescriptionListDescriptionProps
) => ReactElement | null;

export type DescriptionListCompoundedComponent = DescriptionListComponent & {
  /** Wraps a term and its description. Can be styled, columns stay aligned. */
  Group: DescriptionListGroupComponent;
  /** A term, e.g. a field name. */
  Term: DescriptionListTermComponent;
  /** A description of the term, e.g. a field value. */
  Description: DescriptionListDescriptionComponent;
};
