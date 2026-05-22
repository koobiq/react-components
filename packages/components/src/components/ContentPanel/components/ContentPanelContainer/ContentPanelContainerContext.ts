'use client';

import { createContext } from 'react';

import type { OverlayTriggerState } from '@react-stately/overlays';

export type ContentPanelStateContextProps = {
  portalContainer?: HTMLElement | null;
  containerWidth?: number;
  state: OverlayTriggerState;
};

export const ContentPanelContainerContext =
  createContext<ContentPanelStateContextProps>(
    {} as ContentPanelStateContextProps
  );
