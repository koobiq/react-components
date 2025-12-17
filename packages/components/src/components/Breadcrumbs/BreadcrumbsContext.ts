import { useContext, createContext } from 'react';

import type { BreadcrumbsPropSize } from './types';

export type BreadcrumbsContextValue = {
  /** Size. */
  size: BreadcrumbsPropSize;
};

export const BreadcrumbsContext = createContext<BreadcrumbsContextValue>({
  size: 'compact',
});

export const useBreadcrumbsContext = () => useContext(BreadcrumbsContext);
