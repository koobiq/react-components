'use client';

import { createContext } from 'react';

import type { InlineEditSaveErrorHandler } from './types';

export const InlineEditSaveErrorHandlerContext =
  createContext<InlineEditSaveErrorHandler | null>(null);

export const InlineEditSaveErrorHandlerProvider =
  InlineEditSaveErrorHandlerContext.Provider;
