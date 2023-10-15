'use client';

import { createContext, useContext } from 'react';

export const ProviderContext = createContext<object>({});

export function useProvider() {
  return useContext(ProviderContext);
}
