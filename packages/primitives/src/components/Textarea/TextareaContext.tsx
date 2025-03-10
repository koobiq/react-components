import { createContext, useContext } from 'react';

import type { TextareaProps } from './index';

export const TextareaContext = createContext<TextareaProps>({});

export const useTextareaContext = () => useContext(TextareaContext);
