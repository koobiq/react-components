import { useContext, createContext } from 'react';

import type { MultiSelectState } from '@koobiq/react-primitives';

export const SelectContext = createContext<MultiSelectState<object> | null>(
  null
);

export const useSelectContext = () => useContext(SelectContext);
