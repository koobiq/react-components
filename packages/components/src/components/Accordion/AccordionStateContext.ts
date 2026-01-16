import { createContext } from 'react';

import type { DisclosureState } from '@koobiq/react-primitives';

export const AccordionStateContext = createContext<DisclosureState>(
  {} as DisclosureState
);
