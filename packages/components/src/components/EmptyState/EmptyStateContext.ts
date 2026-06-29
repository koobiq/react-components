'use client';

import { createContext } from 'react';

import type { EmptyStatePropAlign, EmptyStatePropSize } from './types';

export type EmptyStateContextValue = {
  size: EmptyStatePropSize;
  isInvalid: boolean;
  align: EmptyStatePropAlign;
};

export const EmptyStateContext = createContext<EmptyStateContextValue>({
  size: 'normal',
  isInvalid: false,
  align: 'center',
});
