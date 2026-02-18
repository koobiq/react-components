'use client';

import { createContext } from 'react';

export type ActionsPanelStateContextProps = {
  portalContainer?: HTMLElement | null;
};

export const ActionsPanelContainerContext =
  createContext<ActionsPanelStateContextProps>(
    {} as ActionsPanelStateContextProps
  );
