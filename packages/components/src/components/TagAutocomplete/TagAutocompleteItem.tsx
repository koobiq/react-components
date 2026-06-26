'use client';

import { Item } from '../Collections';
import type { ItemProps } from '../Collections';

export type TagAutocompleteListItemProps<T extends object = object> =
  ItemProps<T>;

/**
 * Item rendered inside `TagAutocomplete`'s suggestion list. Re-export of the
 * shared collection `Item` so it plugs into `useListState({items, children})`
 * naturally inside the autocomplete state hook.
 */
export const TagAutocompleteListItem = Item;
