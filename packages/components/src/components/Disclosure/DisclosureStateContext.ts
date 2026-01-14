import { createContext } from 'react';

import type { DisclosureState } from '@koobiq/react-primitives';

export const DisclosureStateContext = createContext<DisclosureState>(
  {} as DisclosureState
);
