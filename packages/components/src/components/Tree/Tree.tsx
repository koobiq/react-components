'use client';

import { clsx } from '@koobiq/react-core';
import { Tree as AriaTree, composeRenderProps } from '@koobiq/react-primitives';

import './Tree.css';
import { utilClasses } from '../../styles/utility';
import { ListItemAddon, ListItemText } from '../List/components';

import { TreeItem, TreeItemContent, TreeLoadMoreItem } from './components';
import type { TreeComponent, TreeProps } from './types';

const { list } = utilClasses;

/**
 * A tree provides users with a way to navigate nested hierarchical
 * information, with support for keyboard navigation and selection.
 */
function TreeRender<T extends object>({
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

TreeRender.displayName = 'Tree';

const TreeComponent = TreeRender as TreeComponent;

/**
 * A tree provides users with a way to navigate nested hierarchical information,
 * with support for keyboard navigation and selection.
 */
export const Tree = Object.assign(TreeComponent, {
  Item: TreeItem,
  ItemContent: TreeItemContent,
  ItemContentText: ListItemText,
  ItemContentAddon: ListItemAddon,
  LoadMoreItem: TreeLoadMoreItem,
});
