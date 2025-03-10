'use client';

import { createContext, useContext } from 'react';

import type { DialogContentProps } from './components';

export type DialogContextProps = {
  close?(): void;
  slots?: {
    content?: DialogContentProps;
  };
};

export const DialogContext = createContext<DialogContextProps>(
  {} as DialogContextProps
);

export function useDialogProvider() {
  return useContext(DialogContext);
}
