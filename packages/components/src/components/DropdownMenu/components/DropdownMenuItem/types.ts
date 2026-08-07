import type { DataAttributeProps } from '@koobiq/react-core';
import type { MenuItemProps as AriaMenuItemProps } from '@koobiq/react-primitives';

export const dropdownMenuItemPropAlign = ['start', 'center'] as const;

export type DropdownMenuItemPropAlign =
  (typeof dropdownMenuItemPropAlign)[number];

export type DropdownMenuItemProps<T extends object = object> = Partial<
  AriaMenuItemProps<T>
> &
  DataAttributeProps & {
    /**
     * Vertical alignment of the item content.
     * @default 'center'
     */
    align?: DropdownMenuItemPropAlign;
  };
