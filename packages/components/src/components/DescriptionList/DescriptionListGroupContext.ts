'use client';

import { createContext, useContext } from 'react';

import { once } from '@koobiq/logger';

export const DescriptionListGroupContext = createContext(false);

export function useDescriptionListGroupCheck(name: string) {
  const isInsideGroup = useContext(DescriptionListGroupContext);

  if (process.env.NODE_ENV !== 'production' && !isInsideGroup) {
    once.warn(
      `DescriptionList: "${name}" must be inside "DescriptionList.Group".`
    );
  }
}
