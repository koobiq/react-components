'use client';

import type { FC } from 'react';

import type { ItemProps } from '@koobiq/react-primitives';
import { Item } from '@koobiq/react-primitives';

type ItemComponent<T> = FC<ItemProps<T>> & {
  getCollectionNode: unknown;
};

const ItemInner = Item as ItemComponent<unknown>;

export type ListItemProps<T> = ItemProps<T>;

export function ListItem<T>(props: ListItemProps<T>) {
  return <Item {...props} />;
}

ListItem.getCollectionNode = ItemInner.getCollectionNode;
