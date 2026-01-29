'use client';

import { createContext } from 'react';

import type { ContextValue } from '@koobiq/react-primitives';

import type { ContentPanelProps } from './types';

export const ContentPanelContext =
  createContext<ContextValue<ContentPanelProps, HTMLDivElement>>(null);
