'use client';

import { createContext } from 'react';

import type { DropdownMenuPopoverProps } from './types';

/**
 * Defaults for the popover of a menu, but not of a submenu. Set by a component
 * whose items open menus, like `Navbar`.
 */
export const DropdownMenuPopoverContext = createContext<Pick<
  DropdownMenuPopoverProps,
  'placement' | 'offset'
> | null>(null);
