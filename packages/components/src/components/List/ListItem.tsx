'use client';

import type { CSSProperties, FC } from 'react';

import type { ItemProps } from '@koobiq/react-primitives';
import { Item } from '@koobiq/react-primitives';

type ItemComponent<T> = FC<ItemProps<T>> & {
  getCollectionNode: unknown;
};

const ItemInner = Item as ItemComponent<unknown>;

export type ListItemProps<T> = ItemProps<T> & {
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
};

export function ListItem<T>(props: ListItemProps<T>) {
  return <Item {...props} />;
}

ListItem.getCollectionNode = ItemInner.getCollectionNode;
