'use client';

import { SubmenuTrigger as AriaSubmenuTrigger } from '@koobiq/react-primitives';

import type { DropdownMenuSubmenuTriggerProps } from './types';

/**
 * A wrapper around the item that opens a submenu and the submenu itself.
 * The item gets its chevron automatically.
 */
export function DropdownMenuSubmenuTrigger(
  props: DropdownMenuSubmenuTriggerProps
) {
  return <AriaSubmenuTrigger {...props} />;
}

DropdownMenuSubmenuTrigger.displayName = 'DropdownMenu.SubmenuTrigger';
