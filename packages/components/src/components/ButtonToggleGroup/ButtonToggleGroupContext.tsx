'use client';

import { createContext, useContext } from 'react';

import type { ToggleGroupState } from '@koobiq/react-primitives';

export type ButtonToggleGroupContextProps = {
  state: ToggleGroupState | null;
  savedKey?: string | number;
};

export const ButtonToggleGroupContext =
  createContext<ButtonToggleGroupContextProps>({
    state: null,
  });

export function useButtonToggleGroupContext() {
  return useContext(ButtonToggleGroupContext);
}
