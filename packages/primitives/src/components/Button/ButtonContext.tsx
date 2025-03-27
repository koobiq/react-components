'use client';

import { createContext } from 'react';

import type { ButtonProps } from './index';

export type ButtonContextProps = {
  slots?: Record<string, ButtonProps>;
};

export const ButtonContext = createContext<ButtonContextProps>({});
