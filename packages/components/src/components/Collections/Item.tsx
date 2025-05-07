'use client';

import type { CSSProperties, FC } from 'react';

import { Item as AriaItem } from '@koobiq/react-primitives';
import type { ItemProps as AriaItemProps } from '@koobiq/react-primitives';

type ItemComponent<T> = FC<AriaItemProps<T>> & {
  getCollectionNode: unknown;
};

const ItemInner = AriaItem as ItemComponent<unknown>;

export type ItemProps<T> = AriaItemProps<T> & {
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Item<T>(_props: ItemProps<T>) {
  return null;
}

Item.getCollectionNode = ItemInner.getCollectionNode;
