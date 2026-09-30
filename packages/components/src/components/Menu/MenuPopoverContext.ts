'use client';

import { createContext } from 'react';

import type { PopoverInnerProps } from '../Popover';

/** Default placement shared by menu implementations inside a host component. */
export const MenuPopoverContext = createContext<Pick<
  PopoverInnerProps,
  'placement' | 'offset'
> | null>(null);
