'use client';

import { createContext, useContext } from 'react';
import type { Dispatch, SetStateAction } from 'react';

import type { ToggleGroupState } from '@koobiq/react-primitives';

export type ButtonToggleGroupContextProps = {
  animated?: boolean;
  rootContainerSize?: number;
  equalItemSize?: boolean;
  state: ToggleGroupState | null;
  setSelectedRect?: Dispatch<SetStateAction<DOMRect | undefined>>;
};

export const ButtonToggleGroupContext =
  createContext<ButtonToggleGroupContextProps>({
    state: null,
  });

export function useButtonToggleGroupContext() {
  return useContext(ButtonToggleGroupContext);
}
