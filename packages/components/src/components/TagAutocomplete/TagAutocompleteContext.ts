'use client';

import { createContext, useContext } from 'react';

import type { TagAutocompleteState } from '@koobiq/react-primitives';

export type TagAutocompleteContextValue = TagAutocompleteState<any>;

export const TagAutocompleteContext =
  createContext<TagAutocompleteContextValue | null>(null);

export function useTagAutocompleteContext<T extends object = any>() {
  return useContext(TagAutocompleteContext) as TagAutocompleteState<T> | null;
}
