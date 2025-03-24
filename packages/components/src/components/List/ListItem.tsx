'use client';

import type { ReactNode, FC, ComponentProps } from 'react';

import type { ItemProps } from '@koobiq/react-primitives';
import { Item } from '@koobiq/react-primitives';

type ItemComponent<T> = FC<ItemProps<T>> & {
  getCollectionNode: unknown;
};

const ItemInner = Item as ItemComponent<unknown>;

export type ListItemProps = {
  /** Rendered contents of the item or child items. */
  children: ReactNode;
  /** Rendered contents of the item if `children` contains child items. */
  title?: ReactNode;
} & ComponentProps<'a'>;

export function ListItem(props: ListItemProps) {
  return <Item {...props} />;
}

ListItem.getCollectionNode = ItemInner.getCollectionNode;
