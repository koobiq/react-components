'use client';

import type { ReactNode } from 'react';

import { BreakpointsContext } from './BreakpointsContext';
import type { Breakpoints } from './types';
import { useMatchedBreakpoints } from './utils';

export type BreakpointsProviderProps = {
  children: ReactNode;
  breakpoints: Breakpoints;
};

export const BreakpointsProvider = ({
  children,
  breakpoints: _breakpoints,
}: BreakpointsProviderProps) => {
  const breakpoints = useMatchedBreakpoints(_breakpoints);

  return (
    <BreakpointsContext.Provider value={breakpoints}>
      {children}
    </BreakpointsContext.Provider>
  );
};

BreakpointsProvider.displayName = 'BreakpointsProvider';
