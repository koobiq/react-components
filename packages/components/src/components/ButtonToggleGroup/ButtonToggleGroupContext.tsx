'use client';

import { createContext, useContext } from 'react';

import type { ToggleGroupState } from '@koobiq/react-primitives';

export const ButtonToggleGroupContext = createContext<ToggleGroupState | null>(
  null
);

export function useButtonToggleGroupContext() {
  return useContext(ButtonToggleGroupContext);
}
