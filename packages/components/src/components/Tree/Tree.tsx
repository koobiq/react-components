'use client';

import { clsx } from '@koobiq/react-core';
import type { TreeProps as AriaTreeProps } from '@koobiq/react-primitives';
import { Tree as AriaTree, composeRenderProps } from '@koobiq/react-primitives';

import './Tree.css';
import { utilClasses } from '../../styles/utility';
import { ListItemAddon, ListItemText } from '../List/components';

import { TreeItem, TreeItemContent, TreeLoadMoreItem } from './components';

const { list } = utilClasses;

export type TreeProps<T extends object> = AriaTreeProps<T> & {
  /** Whether the tree has outer padding. */
  isPadded?: boolean;
};

/**
 * A tree provides users with a way to navigate nested hierarchical
 * information, with support for keyboard navigation and selection.
 */
export function TreeComponent<T extends object>({
  className,
  isPadded,
  ...props
}: TreeProps<T>) {
  return (
    <AriaTree
      {...props}
      data-padded={isPadded || undefined}
      className={composeRenderProps(className, (className) =>
        clsx('kbq-Tree', list, className)
      )}
    />
  );
}

TreeComponent.displayName = 'Tree';

type CompoundedComponent = typeof TreeComponent & {
  Item: typeof TreeItem;
  ItemContent: typeof TreeItemContent;
  ItemContentText: typeof ListItemText;
  ItemContentAddon: typeof ListItemAddon;
  LoadMoreItem: typeof TreeLoadMoreItem;
};

/**
 * A tree provides users with a way to navigate nested hierarchical information,
 * with support for keyboard navigation and selection.
 */
export const Tree = TreeComponent as CompoundedComponent;

TreeComponent.Item = TreeItem;
TreeComponent.ItemContent = TreeItemContent;
TreeComponent.ItemContentText = ListItemText;
TreeComponent.ItemContentAddon = ListItemAddon;
TreeComponent.LoadMoreItem = TreeLoadMoreItem;
