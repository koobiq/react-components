'use client';

import { createContext, useContext } from 'react';

import type { ButtonGroupPropVariant } from './types';

export type ButtonGroupContextProps = {
  /** The variant applied to every nested button, overriding their own `variant`. */
  variant?: ButtonGroupPropVariant;
  /** If `true`, every nested button is disabled. */
  isDisabled?: boolean;
};

export const ButtonGroupContext = createContext<ButtonGroupContextProps>({});

export function useButtonGroupContext() {
  return useContext(ButtonGroupContext);
}
