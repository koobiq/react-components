'use client';

import type { CSSProperties, FC } from 'react';

import { Cell as AriaCell } from '@koobiq/react-primitives';
import type { CellProps as AriaCellProps } from '@koobiq/react-primitives';

type CellComponent = FC<AriaCellProps> & {
  getCollectionNode: unknown;
};

const CellInner = AriaCell as CellComponent;

export const cellPropAlign = ['left', 'right', 'center'] as const;
export const cellPropVerticalAlign = [
  'baseline',
  'top',
  'middle',
  'bottom',
  'sub',
  'text-top',
] as const;

export type CellPropAlign = (typeof cellPropAlign)[number];
export type CellPropVerticalAlign = (typeof cellPropVerticalAlign)[number];

export type CellProps = AriaCellProps & {
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
  align?: CellPropAlign;
  /**
   * Vertical alignment of the cell content.
   * @default middle
   * */
  valign?: CellPropVerticalAlign;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Cell(_props: CellProps) {
  return null;
}

Cell.getCollectionNode = CellInner.getCollectionNode;
