import { createContext } from 'react';

import type { ContextValue } from '@koobiq/react-primitives';
import type { DisclosureAria } from '@react-aria/disclosure';

export const AccordionDetailsContext =
  createContext<ContextValue<DisclosureAria['panelProps'], HTMLDivElement>>(
    null
  );
