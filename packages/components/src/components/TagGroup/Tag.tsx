'use client';

import type {
  ComponentPropsWithRef,
  CSSProperties,
  FC,
  ReactNode,
} from 'react';

import type { ItemProps as AriaItemProps } from '@koobiq/react-core';
import { Item as AriaItem } from '@koobiq/react-primitives';

import type { IconButtonProps } from '../IconButton';

type ItemComponent<T> = FC<AriaItemProps<T>> & {
  getCollectionNode: unknown;
};

const ItemInner = AriaItem as ItemComponent<unknown>;

export type TagProps<T> = AriaItemProps<T> & {
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
  /** Icon placed before the children. */
  icon?: ReactNode;
  /** The props used for each slot inside. */
  slotProps?: {
    root?: ComponentPropsWithRef<'div'>;
    icon?: ComponentPropsWithRef<'span'>;
    content?: ComponentPropsWithRef<'span'>;
    removeIcon?: IconButtonProps;
  };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Tag<T>(_props: TagProps<T>) {
  return null;
}

Tag.getCollectionNode = ItemInner.getCollectionNode;
