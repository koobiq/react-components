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

function DropdownMenuComponentRender(props: DropdownMenuProps) {
  return <AriaMenuTrigger {...props} />;
}

DropdownMenuComponentRender.displayName = 'DropdownMenu';

type CompoundedComponent = DropdownMenuComponent & {
  Popover: typeof DropdownMenuPopover;
  Content: typeof DropdownMenuContent;
  Item: typeof DropdownMenuItem;
  ItemText: typeof ListItemText;
  ItemAddon: typeof ListItemAddon;
  Section: typeof DropdownMenuSection;
  Header: typeof DropdownMenuHeader;
  SubmenuTrigger: typeof DropdownMenuSubmenuTrigger;
  Autocomplete: typeof DropdownMenuAutocomplete;
  Footer: typeof DropdownMenuFooter;
  Pressable: typeof Pressable;
};

/**
 * A dropdown menu displays a list of actions or options that a user can choose.
 * The first child is the trigger, the rest is the popover.
 */
export const DropdownMenu: CompoundedComponent = Object.assign(
  DropdownMenuComponentRender,
  {
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
  }
);
