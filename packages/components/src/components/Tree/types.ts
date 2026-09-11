import type { ReactElement } from 'react';

import type { TreeProps as AriaTreeProps } from '@koobiq/react-primitives';

import type { ListItemAddonProps, ListItemTextProps } from '../List/components';

export type TreeItemContentText = ListItemTextProps;
export type TreeItemContentAddon = ListItemAddonProps;
export type TreeItemContentTextProps = ListItemTextProps;
export type TreeItemContentAddonProps = ListItemAddonProps;

export type TreeProps<T extends object> = AriaTreeProps<T> & {
  /** Whether the tree has outer padding. */
  isPadded?: boolean;
};

export type TreeComponent = <T extends object>(
  props: TreeProps<T>
) => ReactElement | null;
