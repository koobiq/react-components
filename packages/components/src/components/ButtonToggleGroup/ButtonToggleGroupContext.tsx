'use client';

import { createContext, useContext } from 'react';

import type { ToggleGroupState } from '@koobiq/react-primitives';

export type ButtonToggleGroupContextProps = {
  state: ToggleGroupState | null;
  onSelectedElementChange?: (element: HTMLButtonElement) => void;
};

export const ButtonToggleGroupContext =
  createContext<ButtonToggleGroupContextProps>({
    state: null,
  });

export function useButtonToggleGroupContext() {
  return useContext(ButtonToggleGroupContext);
}
