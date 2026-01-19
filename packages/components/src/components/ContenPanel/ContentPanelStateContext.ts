import { createContext } from 'react';

import type { OverlayTriggerState } from '@react-stately/overlays';

export type ContentPanelStateContextProps = {
  portalContainer?: HTMLElement | null;
  state: OverlayTriggerState;
};

export const ContentPanelStateContext =
  createContext<ContentPanelStateContextProps>(
    {} as ContentPanelStateContextProps
  );
