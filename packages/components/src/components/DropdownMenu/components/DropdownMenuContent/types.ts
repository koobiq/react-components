import type { ReactNode } from 'react';

import type { DataAttributeProps } from '@koobiq/react-core';
import type { MenuProps as AriaMenuProps } from '@koobiq/react-primitives';

export type DropdownMenuContentProps<T extends object = object> = Omit<
  AriaMenuProps<T>,
  'renderEmptyState' | 'slot'
> &
  DataAttributeProps & {
    /** Content to display when there are no items to show. */
    noItemsText?: ReactNode;
  };
