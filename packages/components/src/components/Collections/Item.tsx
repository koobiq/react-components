'use client';

import type { ReactNode, CSSProperties, FC } from 'react';

import type { ItemProps as AriaItemProps } from '@koobiq/react-core';
import { Item as AriaItem } from '@koobiq/react-primitives';

type ItemComponent<T> = FC<AriaItemProps<T>> & {
  getCollectionNode: unknown;
};

const ItemInner = AriaItem as ItemComponent<unknown>;

export const itemPropAlign = ['start', 'center'] as const;

export type ItemPropAlign = (typeof itemPropAlign)[number];

export type ItemProps<T> = Omit<AriaItemProps<T>, 'children'> & {
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
  /** Rendered contents of the item or child items. */
  children?: ReactNode;
  /**
   * Vertical alignment of the item content.
   * @default 'center'
   */
  align?: ItemPropAlign;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Item<T>(_props: ItemProps<T>) {
  return null;
}

Item.getCollectionNode = ItemInner.getCollectionNode;
