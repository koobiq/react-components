'use client';

import { createContext } from 'react';

import type { CheckboxGroupState } from '../../index';

export type CheckboxGroupContextProps = CheckboxGroupState;

export const CheckboxGroupContext = createContext<CheckboxGroupContextProps>(
  {} as CheckboxGroupContextProps
);
