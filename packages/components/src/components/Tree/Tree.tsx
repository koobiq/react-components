'use client';

import { clsx } from '@koobiq/react-core';
import type { TreeProps } from '@koobiq/react-primitives';
import { Tree as AriaTree } from '@koobiq/react-primitives';

import './Tree.css';
import { utilClasses } from '../../styles/utility';

import { TreeItem, TreeItemContent, TreeLoadMoreItem } from './components';

const { list } = utilClasses;

export type { TreeProps };

export function TreeComponent<T extends object>(props: TreeProps<T>) {
  return <AriaTree className={clsx('kbq-Tree', list)} {...props} />;
}

TreeComponent.displayName = 'Tree';

type CompoundedComponent = typeof TreeComponent & {
  Item: typeof TreeItem;
  ItemContent: typeof TreeItemContent;
  LoadMoreItem: typeof TreeLoadMoreItem;
};

export const Tree = TreeComponent as CompoundedComponent;

TreeComponent.Item = TreeItem;
TreeComponent.ItemContent = TreeItemContent;
TreeComponent.LoadMoreItem = TreeLoadMoreItem;
