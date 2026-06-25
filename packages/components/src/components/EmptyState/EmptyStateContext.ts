'use client';

import { createContext } from 'react';

import type { EmptyStatePropSize, EmptyStatePropState } from './types';

export type EmptyStateContextValue = {
  size: EmptyStatePropSize;
  state: EmptyStatePropState;
};

export const EmptyStateContext = createContext<EmptyStateContextValue>({
  size: 'normal',
  state: 'default',
});
