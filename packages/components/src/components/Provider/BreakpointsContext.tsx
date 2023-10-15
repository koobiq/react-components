'use client';

import { createContext, useContext } from 'react';

import type { Breakpoints } from './types';

export type BreakpointsContextType = Record<keyof Breakpoints, boolean>;

export const BreakpointsContext = createContext<BreakpointsContextType>(
  {} as BreakpointsContextType
);

export function useBreakpoints() {
  return useContext(BreakpointsContext);
}
