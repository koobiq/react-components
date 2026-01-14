import { createContext } from 'react';

import type { DisclosureGroupState } from '@koobiq/react-primitives';

export const DisclosureGroupStateContext =
  createContext<DisclosureGroupState | null>(null);
