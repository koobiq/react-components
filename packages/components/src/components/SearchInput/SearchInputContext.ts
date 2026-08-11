'use client';

import { createContext } from 'react';

import type { ContextValue } from '@koobiq/react-primitives';

import type { SearchInputProps, SearchInputRef } from './types';

export type SearchInputContextProps = SearchInputProps & {
  slot?: string | null;
};

export const SearchInputContext = createContext<
  ContextValue<SearchInputContextProps, SearchInputRef>
>({});
