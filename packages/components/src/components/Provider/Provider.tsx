'use client';

import { BreakpointsProvider } from './BreakpointsProvider';
import { ProviderContext } from './ProviderContext';
import type { Breakpoints, ProviderProps } from './types';

export const breakpoints: Breakpoints = {
  xs: 0, // (min-width: 0px)
  s: 480, // (min-width: 480px)
  m: 768, // (min-width: 768px)
  l: 1024, // (min-width: 1024px)
  xl: 1280, // (min-width: 1280px)
  xxl: 1536, // (min-width: 1536px)
};

export const defaultConfig = {
  breakpoints,
};

export const Provider = ({
  children,
  config = defaultConfig,
}: ProviderProps) => (
  <ProviderContext.Provider value={{}}>
    <BreakpointsProvider breakpoints={config.breakpoints}>
      {children}
    </BreakpointsProvider>
  </ProviderContext.Provider>
);

Provider.displayName = 'Provider';
