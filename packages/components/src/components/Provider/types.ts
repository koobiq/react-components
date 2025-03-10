import type { ReactNode } from 'react';

import type { I18nProviderProps } from '@koobiq/react-primitives';

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
  children?: ReactNode;
  breakpoints?: Breakpoints;
  locale?: I18nProviderProps['locale'];
};
