import type { DataAttributeProps } from '@koobiq/react-core';
import type { MenuProps as AriaMenuProps } from '@koobiq/react-primitives';

export type DropdownMenuContentProps<T extends object = object> = Omit<
  AriaMenuProps<T>,
  'slot'
> &
  DataAttributeProps;
