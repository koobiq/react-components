'use client';

import { createContext, useContext } from 'react';

import type { CheckboxGroupPropSize } from './index';

export type CheckboxGroupContextProps = {
  size?: CheckboxGroupPropSize;
};

export const CheckboxGroupContext = createContext<CheckboxGroupContextProps>(
  {} as CheckboxGroupContextProps
);

export const useCheckboxGroupState = () => useContext(CheckboxGroupContext);
