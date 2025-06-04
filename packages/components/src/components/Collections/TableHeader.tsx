'use client';

import type { CSSProperties, FC } from 'react';

import { TableHeader as AriaTableHeader } from '@koobiq/react-primitives';
import type { TableHeaderProps as AriaTableHeaderProps } from '@koobiq/react-primitives';

type TableHeaderComponent<T> = FC<AriaTableHeaderProps<T>> & {
  getCollectionNode: unknown;
};

const TableHeaderInner = AriaTableHeader as TableHeaderComponent<unknown>;

export type TableHeaderProps<T> = AriaTableHeaderProps<T> & {
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function TableHeader<T>(_props: TableHeaderProps<T>) {
  return null;
}

TableHeader.getCollectionNode = TableHeaderInner.getCollectionNode;
