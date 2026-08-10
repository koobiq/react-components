'use client';

import { useFilter } from '@koobiq/react-core';
import { Autocomplete as AriaAutocomplete } from '@koobiq/react-primitives';

import type { DropdownMenuAutocompleteProps } from './types';

/**
 * Filters the items of a dropdown menu with a field. The field has to be a
 * sibling of the menu, not a child of it: the menu clears the field context for
 * its own subtree. The field may also live outside the popover, next to the
 * whole `DropdownMenu`.
 */
export function DropdownMenuAutocomplete(props: DropdownMenuAutocompleteProps) {
  const { contains } = useFilter({ sensitivity: 'base' });

  return <AriaAutocomplete filter={contains} {...props} />;
}

DropdownMenuAutocomplete.displayName = 'DropdownMenu.Autocomplete';
