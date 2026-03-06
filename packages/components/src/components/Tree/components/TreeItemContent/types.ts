import type { DataAttributeProps } from '@koobiq/react-core';
import type { TreeItemContentProps as AriaTreeItemContentProps } from '@koobiq/react-primitives';

import type { CheckboxProps } from '../../../Checkbox';
import type { IconButtonProps } from '../../../IconButton';

export type TreeItemContentPropSlotProps = {
  chevron?: Omit<IconButtonProps, 'slot' | 'children'> & DataAttributeProps;
  checkbox?: Omit<CheckboxProps, 'slot'>;
};

export type TreeItemContentProps = AriaTreeItemContentProps & {
  slotProps?: TreeItemContentPropSlotProps;
} & DataAttributeProps;
