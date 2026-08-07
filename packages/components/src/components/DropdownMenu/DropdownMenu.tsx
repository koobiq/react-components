'use client';

import { Pressable } from '@koobiq/react-core';
import { MenuTrigger as AriaMenuTrigger } from '@koobiq/react-primitives';

import { ListItemText } from '../List';
import { ListItemAddon } from '../List/components';

import {
  DropdownMenuContent,
  DropdownMenuHeader,
  DropdownMenuItem,
  DropdownMenuSection,
  DropdownMenuSeparator,
  DropdownMenuSubmenuTrigger,
  DropdownMenuTrigger,
} from './components';
import type { DropdownMenuComponent, DropdownMenuProps } from './types';

function DropdownMenuComponentRender(props: DropdownMenuProps) {
  return <AriaMenuTrigger {...props} />;
}

DropdownMenuComponentRender.displayName = 'DropdownMenu';

type CompoundedComponent = DropdownMenuComponent & {
  Trigger: typeof DropdownMenuTrigger;
  Content: typeof DropdownMenuContent;
  Item: typeof DropdownMenuItem;
  ItemText: typeof ListItemText;
  ItemAddon: typeof ListItemAddon;
  Section: typeof DropdownMenuSection;
  Header: typeof DropdownMenuHeader;
  Separator: typeof DropdownMenuSeparator;
  SubmenuTrigger: typeof DropdownMenuSubmenuTrigger;
  Pressable: typeof Pressable;
};

/** A dropdown menu displays a list of actions or options that a user can choose. */
export const DropdownMenu: CompoundedComponent = Object.assign(
  DropdownMenuComponentRender,
  {
    Trigger: DropdownMenuTrigger,
    Content: DropdownMenuContent,
    Item: DropdownMenuItem,
    ItemText: ListItemText,
    ItemAddon: ListItemAddon,
    Section: DropdownMenuSection,
    Header: DropdownMenuHeader,
    Separator: DropdownMenuSeparator,
    SubmenuTrigger: DropdownMenuSubmenuTrigger,
    Pressable,
  }
);
