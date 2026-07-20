import { createContext, useContext } from 'react';

import type { ResizableContextValue } from './hooks';

export const ResizableContext = createContext<ResizableContextValue | null>(
  null
);

export const useResizableContext = () => {
  const context = useContext(ResizableContext);

  if (!context) {
    throw new Error('Resizable.Handle must be rendered inside Resizable.');
  }

  return context;
};
