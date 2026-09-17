import { createContext } from 'react';
import type { RefObject } from 'react';

export type ListItemContextValue = {
  /** The item element. */
  ref?: RefObject<HTMLElement | null>;
  /** Whether the pointer is over the item. */
  isHovered?: boolean;
  /** Whether the item opens a submenu. */
  hasSubmenu?: boolean;
};

/** Passes the state of a list item to its content. */
export const ListItemContext = createContext<ListItemContextValue>({});
