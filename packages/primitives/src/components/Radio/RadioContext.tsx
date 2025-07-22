'use client';

import { createContext } from 'react';

import type { RadioGroupState } from '@react-stately/radio';

export const RadioContext = createContext<RadioGroupState>(
  {} as RadioGroupState
);
