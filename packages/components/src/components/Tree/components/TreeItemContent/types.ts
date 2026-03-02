import type { ReactNode } from 'react';

import type { TreeItemContentProps as AriaTreeItemContentProps } from '@koobiq/react-primitives';

import type { CheckboxProps } from '../../../Checkbox';
import type { IconButtonProps } from '../../../IconButton';

export type TreeItemContentPropSlotProps = {
  chevron?: Omit<IconButtonProps, 'slot' | 'children'>;
  selection?: Omit<CheckboxProps, 'slot'>;
};

export type TreeItemContentProps = Omit<
  AriaTreeItemContentProps,
  'children'
> & {
  children?: ReactNode;
  slotProps?: TreeItemContentPropSlotProps;
};
