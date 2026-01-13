'use client';

import { createContext } from 'react';

import type { ContextValue } from '../../utils';

import type { LabelProps } from './index';

export const LabelContext =
  createContext<ContextValue<LabelProps, HTMLElement>>(null);
