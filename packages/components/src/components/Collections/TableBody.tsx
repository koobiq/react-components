'use client';

import type { CSSProperties, FC } from 'react';

import { TableBody as AriaTableBody } from '@koobiq/react-primitives';
import type { TableBodyProps as AriaTableBodyProps } from '@koobiq/react-primitives';

type TableBodyComponent<T> = FC<AriaTableBodyProps<T>> & {
  getCollectionNode: unknown;
};

const TableBodyInner = AriaTableBody as TableBodyComponent<unknown>;

export type TableBodyProps<T> = AriaTableBodyProps<T> & {
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function TableBody<T>(_props: TableBodyProps<T>) {
  return null;
}

TableBody.getCollectionNode = TableBodyInner.getCollectionNode;
