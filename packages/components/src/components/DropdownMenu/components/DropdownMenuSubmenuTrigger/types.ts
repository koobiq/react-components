import type { ReactElement } from 'react';

export type DropdownMenuSubmenuTriggerProps = {
  /**
   * The item that opens the submenu, followed by the submenu itself
   * (a `DropdownMenu.Content`).
   */
  children: ReactElement[];
  /**
   * The delay in milliseconds before the submenu opens on hover.
   * @default 200
   */
  delay?: number;
};
