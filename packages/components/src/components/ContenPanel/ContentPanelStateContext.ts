import { createContext, type RefObject } from 'react';

import type { OverlayTriggerState } from '@react-stately/overlays';

export type ContentPanelStateContextProps = {
  containerRef?: RefObject<HTMLElement>;
  state: OverlayTriggerState;
};

export const ContentPanelStateContext =
  createContext<ContentPanelStateContextProps>(
    {} as ContentPanelStateContextProps
  );
