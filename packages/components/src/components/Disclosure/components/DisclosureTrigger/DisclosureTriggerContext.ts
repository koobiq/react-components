import { createContext } from 'react';

import type { ContextValue } from '@koobiq/react-primitives';
import type { DisclosureAria } from '@react-aria/disclosure';

export const DisclosureTriggerContext =
  createContext<ContextValue<DisclosureAria['buttonProps'], HTMLButtonElement>>(
    null
  );
