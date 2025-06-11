'use client';

import type { FC } from 'react';

import { TableHeader as AriaTableHeader } from '@koobiq/react-primitives';
import type { TableHeaderProps as AriaTableHeaderProps } from '@koobiq/react-primitives';

type TableHeaderComponent<T> = FC<AriaTableHeaderProps<T>> & {
  getCollectionNode: unknown;
};

const TableHeaderInner = AriaTableHeader as TableHeaderComponent<unknown>;

export type TableHeaderProps<T> = AriaTableHeaderProps<T>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function TableHeader<T>(_props: TableHeaderProps<T>) {
  return null;
}

TableHeader.getCollectionNode = TableHeaderInner.getCollectionNode;
