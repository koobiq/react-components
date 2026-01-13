'use client';

import { createContext } from 'react';

import type { ContextValue } from '../../utils';

import type { ButtonProps } from './index';

export const ButtonContext = createContext<
  ContextValue<ButtonProps, HTMLElement>
>({});
