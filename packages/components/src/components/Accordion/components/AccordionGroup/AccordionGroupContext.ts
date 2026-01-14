import { createContext } from 'react';

import type { DisclosureGroupState } from '@koobiq/react-primitives';

export const AccordionGroupStateContext =
  createContext<DisclosureGroupState | null>(null);
