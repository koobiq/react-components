import type { ReactNode } from 'react';

import type { I18nProviderProps, RouterProvider } from '@koobiq/react-core';

export type Breakpoints = {
  xs?: number;
  s?: number;
  m?: number;
  l?: number;
  xl?: number;
  xxl?: number;
  [custom: string]: number | undefined;
};

export type ProviderProps = {
  /** The content of the component. */
  children?: ReactNode;
  /** Responsive breakpoints for your application. */
  breakpoints?: Breakpoints;
  /** SSR-fallback for responsive breakpoints for your application. */
  breakpointsFallback?: boolean[];
  /** The locale for your application as a [BCP 47](https://www.ietf.org/rfc/bcp/bcp47.txt) language code. Defaults to the browser/OS language setting. */
  locale?: I18nProviderProps['locale'];
  /** Configuration object for routing. If provided, wraps children in a RouterProvider. */
  router?: Omit<Parameters<typeof RouterProvider>[0], 'children'>;
};
