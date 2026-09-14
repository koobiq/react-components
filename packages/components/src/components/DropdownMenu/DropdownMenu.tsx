'use client';

import { Pressable } from '@koobiq/react-core';
import { MenuTrigger as AriaMenuTrigger } from '@koobiq/react-primitives';

import { ListItemText } from '../List';
import { ListItemAddon } from '../List/components';

import {
  DropdownMenuAutocomplete,
  DropdownMenuContent,
  DropdownMenuFooter,
  DropdownMenuHeader,
  DropdownMenuItem,
  DropdownMenuPopover,
  DropdownMenuSection,
  DropdownMenuSubmenuTrigger,
} from './components';
import type { DropdownMenuComponent, DropdownMenuProps } from './types';

function DropdownMenuRender(props: DropdownMenuProps) {
  return <AriaMenuTrigger {...props} />;
}

DropdownMenuRender.displayName = 'DropdownMenu';

const DropdownMenuComponent = DropdownMenuRender as DropdownMenuComponent;

/**
 * A dropdown menu displays a list of actions or options that a user can choose.
 * The first child is the trigger, the rest is the popover.
 */
export const DropdownMenu = Object.assign(DropdownMenuComponent, {
  Popover: DropdownMenuPopover,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  ItemText: ListItemText,
  ItemAddon: ListItemAddon,
  Section: DropdownMenuSection,
  Header: DropdownMenuHeader,
  SubmenuTrigger: DropdownMenuSubmenuTrigger,
  Autocomplete: DropdownMenuAutocomplete,
  Footer: DropdownMenuFooter,
  Pressable,
});
