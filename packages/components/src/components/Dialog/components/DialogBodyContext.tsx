import { createContext } from 'react';

import type { ContextValue } from '@koobiq/react-primitives';

import type { DialogBodyProps } from './DialogBody';

export const DialogBodyContext =
  createContext<ContextValue<DialogBodyProps, HTMLDivElement>>(null);
