'use client';

import type { ReactNode } from 'react';

import { BreakpointsContext } from './BreakpointsContext';
import type { Breakpoints } from './types';
import { useBreakpoints } from './utils';

export type BreakpointsProviderProps = {
  children: ReactNode;
  breakpoints: Breakpoints;
  defaultMatches?: boolean[];
};

export const BreakpointsProvider = ({
  children,
  defaultMatches,
  breakpoints: _breakpoints,
}: BreakpointsProviderProps) => {
  const breakpoints = useBreakpoints(
    _breakpoints,
    defaultMatches && {
      ssr: true,
      defaultMatches,
    }
  );

  return (
    <BreakpointsContext.Provider value={breakpoints}>
      {children}
    </BreakpointsContext.Provider>
  );
};

BreakpointsProvider.displayName = 'BreakpointsProvider';
