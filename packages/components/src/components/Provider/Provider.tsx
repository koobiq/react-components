'use client';

import { I18nProvider } from '@koobiq/react-primitives';

import { BreakpointsProvider } from './BreakpointsProvider';
import { ProviderContext } from './ProviderContext';
import type { Breakpoints, ProviderProps } from './types';

export const defaultBreakpoints: Breakpoints = {
  xs: 0, // (min-width: 0px)
  s: 480, // (min-width: 480px)
  m: 768, // (min-width: 768px)
  l: 1024, // (min-width: 1024px)
  xl: 1280, // (min-width: 1280px)
  xxl: 1536, // (min-width: 1536px)
};

export const Provider = ({
  breakpoints = defaultBreakpoints,
  children,
  locale,
}: ProviderProps) => (
  <ProviderContext.Provider value={{ breakpoints, locale }}>
    <I18nProvider locale={locale}>
      <BreakpointsProvider breakpoints={breakpoints}>
        {children}
      </BreakpointsProvider>
    </I18nProvider>
  </ProviderContext.Provider>
);

Provider.displayName = 'Provider';
