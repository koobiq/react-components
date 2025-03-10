import { createContext } from 'react';

import type { RadioGroupState } from '../../behaviors';

export const RadioContext = createContext<RadioGroupState>(
  {} as RadioGroupState
);
