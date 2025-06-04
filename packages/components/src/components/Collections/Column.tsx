'use client';

import type { CSSProperties, FC } from 'react';

import { Column as AriaColumn } from '@koobiq/react-primitives';
import type { ColumnProps as AriaColumnProps } from '@koobiq/react-primitives';

type ColumnComponent<T> = FC<AriaColumnProps<T>> & {
  getCollectionNode: unknown;
};

const ColumnInner = AriaColumn as ColumnComponent<unknown>;

export const columnPropAlign = ['left', 'right', 'center'] as const;
export const columnPropVerticalAlign = [
  'baseline',
  'top',
  'middle',
  'bottom',
  'sub',
  'text-top',
] as const;

export type ColumnPropAlign = (typeof columnPropAlign)[number];
export type ColumnPropVerticalAlign = (typeof columnPropVerticalAlign)[number];

export type ColumnProps<T> = AriaColumnProps<T> & {
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
  /**
   * Horizontal alignment of the cell content.
   * @default left
   * */
  align?: ColumnPropAlign;
  /**
   * Vertical alignment of the cell content.
   * @default middle
   * */
  valign?: ColumnPropVerticalAlign;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Column<T>(_props: ColumnProps<T>) {
  return null;
}

Column.getCollectionNode = ColumnInner.getCollectionNode;
