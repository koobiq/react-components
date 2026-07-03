import type { DataAttributeProps } from '@koobiq/react-core';
import type { TreeItemProps as AriaTreeItemProps } from '@koobiq/react-primitives';

import type { ItemPropAlign } from '../../../Collections';

export type TreeItemProps = Partial<AriaTreeItemProps> &
  DataAttributeProps & {
    /**
     * Vertical alignment of the item content.
     * @default 'center'
     */
    align?: ItemPropAlign;
  };
