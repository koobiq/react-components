'use client';

import { createContext } from 'react';

import type { CheckboxGroupState } from '../../index';

export type CheckboxGroupContextProps = CheckboxGroupState | null;

export const CheckboxGroupContext =
  createContext<CheckboxGroupContextProps>(null);
