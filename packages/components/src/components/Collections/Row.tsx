'use client';

import type { CSSProperties, FC } from 'react';

import { Row as AriaRow } from '@koobiq/react-primitives';
import type { RowProps as AriaRowProps } from '@koobiq/react-primitives';

type RowComponent<T> = FC<AriaRowProps<T>> & {
  getCollectionNode: unknown;
};

const RowInner = AriaRow as RowComponent<unknown>;

export type RowProps<T> = AriaRowProps<T> & {
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Row<T>(_props: RowProps<T>) {
  return null;
}

Row.getCollectionNode = RowInner.getCollectionNode;
