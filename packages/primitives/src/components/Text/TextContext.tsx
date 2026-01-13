'use client';

import { createContext } from 'react';

import type { ContextValue } from '../../utils';

import type { TextProps } from './Text';

export const TextContext = createContext<ContextValue<TextProps, HTMLElement>>(
  {}
);
