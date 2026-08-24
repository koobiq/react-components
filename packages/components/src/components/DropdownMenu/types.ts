import type { ComponentProps, ReactElement, ReactNode } from 'react';

import type { Pressable } from '@koobiq/react-core';

import type { ListItemTextProps } from '../List';
import type { ListItemAddonProps } from '../List/components';
import type { PopoverPropPlacement } from '../Popover';
import { popoverPropPlacement } from '../Popover';

export const dropdownMenuPropTrigger = ['press', 'longPress'] as const;

export type DropdownMenuPropTrigger = (typeof dropdownMenuPropTrigger)[number];

export const dropdownMenuPropPlacement = popoverPropPlacement;

export type DropdownMenuPropPlacement = PopoverPropPlacement;

export type DropdownMenuItemTextProps = ListItemTextProps;
export type DropdownMenuItemAddonProps = ListItemAddonProps;
export type DropdownMenuPressableProps = ComponentProps<typeof Pressable>;

export type DropdownMenuProps = {
  /** The trigger and the content of the menu. */
  children: ReactNode;
  /** Whether the menu is open (controlled). */
  isOpen?: boolean;
  /** Whether the menu is open by default (uncontrolled). */
  defaultOpen?: boolean;
  /** Handler that is called when the open state of the menu changes. */
  onOpenChange?: (isOpen: boolean) => void;
  /**
   * How the menu is opened by the trigger.
   * @default 'press'
   */
  trigger?: DropdownMenuPropTrigger;
};

export type DropdownMenuComponent = (
  props: DropdownMenuProps
) => ReactElement | null;
