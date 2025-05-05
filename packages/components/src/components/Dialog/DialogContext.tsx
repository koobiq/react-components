'use client';

import { createContext, useContext } from 'react';

import type { DialogBodyProps } from './index';

export type DialogContextProps = {
  close?(): void;
  slots?: {
    body?: DialogBodyProps;
  };
};

export const DialogContext = createContext<DialogContextProps>(
  {} as DialogContextProps
);

export function useDialogProvider() {
  return useContext(DialogContext);
}
