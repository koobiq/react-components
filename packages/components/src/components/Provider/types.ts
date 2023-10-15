import type { ReactNode } from 'react';

export type Breakpoints = {
  xs?: number;
  s?: number;
  m?: number;
  l?: number;
  xl?: number;
  xxl?: number;
  [custom: string]: number | undefined;
};

export type ProviderPropConfig = {
  breakpoints: Breakpoints;
};

export type ProviderProps = {
  children?: ReactNode;
  config?: ProviderPropConfig;
};
