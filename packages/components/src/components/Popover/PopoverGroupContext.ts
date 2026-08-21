'use client';

import type { RefObject } from 'react';
import { createContext } from 'react';

/**
 * The container of the outermost popover of a group, such as a menu and its
 * submenus. A nested popover renders into it and shares its outside-interaction
 * detection, so the whole group closes at once.
 */
export const PopoverGroupContext =
  createContext<RefObject<HTMLDivElement | null> | null>(null);
