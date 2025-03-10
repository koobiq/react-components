'use client';

import type { ReactNode } from 'react';

import { BreakpointsContext } from './BreakpointsContext';
import type { Breakpoints } from './types';
import { useBreakpoints } from './utils';

export type BreakpointsProviderProps = {
  children: ReactNode;
  breakpoints: Breakpoints;
};

export const BreakpointsProvider = ({
  children,
  breakpoints: _breakpoints,
}: BreakpointsProviderProps) => {
  const breakpoints = useBreakpoints(_breakpoints);

  return (
    <BreakpointsContext.Provider value={breakpoints}>
      {children}
    </BreakpointsContext.Provider>
  );
};

BreakpointsProvider.displayName = 'BreakpointsProvider';
