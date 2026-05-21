'use client';

import type {
  ReactNode,
  CSSProperties,
  FC,
  ComponentPropsWithRef,
} from 'react';

import type { ItemProps as AriaItemProps } from '@koobiq/react-core';
import { Item as AriaItem } from '@koobiq/react-primitives';

import type { IconButtonProps } from '../IconButton';

type ItemComponent<T> = FC<AriaItemProps<T>> & {
  getCollectionNode: unknown;
};

const TagInner = AriaItem as ItemComponent<unknown>;

type TagSlotProps = {
  root?: ComponentPropsWithRef<'div'>;
  icon?: ComponentPropsWithRef<'span'>;
  content?: ComponentPropsWithRef<'span'>;
  removeIcon?: IconButtonProps;
};

type AriaTagItemProps<T> = Omit<
  AriaItemProps<T>,
  | 'children'
  | 'href'
  | 'hrefLang'
  | 'target'
  | 'rel'
  | 'download'
  | 'ping'
  | 'referrerPolicy'
  | 'title'
  | 'childItems'
  | 'hasChildItems'
>;

export type TagProps<T> = AriaTagItemProps<T> & {
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
  /** Icon placed before the children. */
  icon?: ReactNode;
  /** Whether the tag is disabled. */
  isDisabled?: boolean;
  /** The props used for each slot inside. */
  slotProps?: TagSlotProps;
  /** Rendered contents of the tag. */
  children?: ReactNode;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Tag<T>(_props: TagProps<T>) {
  return null;
}

Tag.getCollectionNode = TagInner.getCollectionNode;
