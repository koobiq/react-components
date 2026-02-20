'use client';

import { createContext } from 'react';

import type { ContextValue } from '@koobiq/react-primitives';

import type { ActionsPanelProps } from './types';

export const ActionsPanelContext =
  createContext<ContextValue<ActionsPanelProps, HTMLDivElement>>(null);
