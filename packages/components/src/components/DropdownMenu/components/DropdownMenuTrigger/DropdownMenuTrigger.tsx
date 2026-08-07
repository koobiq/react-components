'use client';

import type { DropdownMenuTriggerProps } from './types';

/**
 * A wrapper for the element that opens the menu.
 *
 * Renders no DOM: the child gets the trigger props from the press responder.
 * Wrapping it in `Pressable` here would call `usePress` twice and toggle the
 * menu open and closed in one press.
 */
export function DropdownMenuTrigger({ children }: DropdownMenuTriggerProps) {
  return <>{children}</>;
}

DropdownMenuTrigger.displayName = 'DropdownMenu.Trigger';
