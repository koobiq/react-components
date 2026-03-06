import type { DataAttributeProps } from '@koobiq/react-core';
import type { TreeItemProps as AriaTreeItemProps } from '@koobiq/react-primitives';

export type TreeItemProps = Partial<AriaTreeItemProps> & DataAttributeProps;
