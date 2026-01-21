'use client';

import { createContext } from 'react';

import type { ContextValue } from '@koobiq/react-primitives';

export const ContentPanelContext =
  createContext<ContextValue<object, HTMLElement>>(null);
