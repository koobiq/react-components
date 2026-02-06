import { createContext } from 'react';

import type { ListState } from '@koobiq/react-primitives';

export const SelectContext = createContext<ListState<object> | null>(null);
