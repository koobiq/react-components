import type { DataAttributeProps } from '@koobiq/react-core';
import type { TreeItemProps as AriaTreeItemProps } from '@koobiq/react-primitives';

export const treeItemPropAlign = ['start', 'center'] as const;

export type TreeItemPropAlign = (typeof treeItemPropAlign)[number];

export type TreeItemProps = Partial<AriaTreeItemProps> &
  DataAttributeProps & {
    /**
     * Vertical alignment of the item content.
     * @default 'center'
     */
    align?: TreeItemPropAlign;
  };
