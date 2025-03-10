'use client';

import { createContext, useContext } from 'react';

import type { ProviderProps } from './types';

export const ProviderContext = createContext<ProviderProps>(
  {} as ProviderProps
);

export function useProvider() {
  return useContext(ProviderContext);
}
