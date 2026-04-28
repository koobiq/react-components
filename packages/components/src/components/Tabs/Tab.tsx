'use client';

import type {
  ComponentPropsWithRef,
  CSSProperties,
  FC,
  ReactNode,
} from 'react';

import type { ItemProps as AriaItemProps } from '@koobiq/react-core';
import { Item as AriaItem } from '@koobiq/react-primitives';

type ItemComponent<T> = FC<AriaItemProps<T>> & {
  getCollectionNode: (
    props: AriaItemProps<T>,
    context: unknown
  ) => Generator<unknown, void, unknown>;
};

const ItemInner = AriaItem as ItemComponent<unknown>;

export type TabProps<T> = Omit<AriaItemProps<T>, 'children'> & {
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
  /** The tab label for simple tabs or the tab panel contents when `title` or `onlyIcon` is provided. */
  children?: ReactNode;
  /** Addon displayed before the content. */
  startAddon?: ReactNode;
  /** Addon displayed after the content. */
  endAddon?: ReactNode;
  /** Renders the trigger without a visible label. Provide `aria-label` for accessibility. */
  onlyIcon?: boolean;
  /** The props used for each slot inside. */
  slotProps?: {
    content?: ComponentPropsWithRef<'div'>;
    label?: ComponentPropsWithRef<'div'>;
    startAddon?: ComponentPropsWithRef<'div'>;
    endAddon?: ComponentPropsWithRef<'div'>;
  };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Tab<T>(_props: TabProps<T>) {
  return null;
}

Tab.getCollectionNode = function* getCollectionNode<T>(
  props: TabProps<T>,
  context: unknown
): Generator<unknown, void, unknown> {
  yield* ItemInner.getCollectionNode(props as AriaItemProps<T>, context);
};
