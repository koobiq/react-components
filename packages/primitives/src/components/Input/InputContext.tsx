import { createContext, useContext } from 'react';

import type { InputProps } from './index';

export const InputContext = createContext<InputProps>({});

export const useInputContext = () => useContext(InputContext);
