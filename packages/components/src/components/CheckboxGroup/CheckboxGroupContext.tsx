'use client';

import { createContext, useContext } from 'react';

import type { CheckboxGroupState } from '@koobiq/react-primitives';

import type { CheckboxGroupPropSize } from './index';

export type CheckboxGroupContextProps = {
  size?: CheckboxGroupPropSize;
} & CheckboxGroupState;

export const CheckboxGroupContext = createContext<CheckboxGroupContextProps>(
  {} as CheckboxGroupContextProps
);

export const useCheckboxGroupState = () => useContext(CheckboxGroupContext);
