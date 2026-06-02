'use client';

import { createContext, useContext } from 'react';

import type { TagAutocompleteAria } from '@koobiq/react-primitives';

export type TagAutocompleteListContextValue<T extends object = any> =
  TagAutocompleteAria<T> & {
    anchorWidth: number;
  };

export const TagAutocompleteListContext =
  createContext<TagAutocompleteListContextValue | null>(null);

export function useTagAutocompleteListContext<T extends object = any>() {
  return useContext(
    TagAutocompleteListContext
  ) as TagAutocompleteListContextValue<T> | null;
}
