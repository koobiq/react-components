'use client';

import type { CSSProperties, FC } from 'react';

import { Cell as AriaCell } from '@koobiq/react-primitives';
import type { CellProps as AriaCellProps } from '@koobiq/react-primitives';

type CellComponent = FC<AriaCellProps> & {
  getCollectionNode: unknown;
};

const CellInner = AriaCell as CellComponent;

export type CellProps = AriaCellProps & {
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Cell(_props: CellProps) {
  return null;
}

Cell.getCollectionNode = CellInner.getCollectionNode;
