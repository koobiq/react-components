'use client';

import { createContext } from 'react';

import type { TextProps } from './Text';

export type TextContextProps = {
  slots?: Record<string, TextProps>;
};

export const TextContext = createContext<TextContextProps>({});
