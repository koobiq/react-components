import type { CSSProperties, ReactElement, ReactNode } from 'react';

import type { TransitionProps } from 'react-transition-group/Transition';

export const sidebarPropPlacement = ['start', 'end'] as const;

export type SidebarPropPlacement = (typeof sidebarPropPlacement)[number];

export type SidebarRenderProps = {
  /** Whether the sidebar is currently showing its open content. */
  isOpen: boolean;
  /** Opens the sidebar. */
  open: () => void;
  /** Closes the sidebar. */
  close: () => void;
  /** Toggles the sidebar between its open and closed states. */
  toggle: () => void;
};

export type SidebarPropContent =
  | ReactNode
  | ((props: SidebarRenderProps) => ReactElement);

export type SidebarBaseProps = {
  /**
   * The content of the sidebar. Pass a function to render different content per
   * state — it receives the current state and the `open`, `close` and `toggle`
   * actions.
   */
  children?: SidebarPropContent;
  /** If `true`, the sidebar is open. */
  isOpen?: boolean;
  /**
   * The default open state. Use when the component is not controlled.
   * @default false
   */
  defaultOpen?: boolean;
  /** Handler that is called when the sidebar's open state changes. */
  onOpenChange?: (isOpen: boolean) => void;
  /**
   * The inline size of the sidebar while it is open, in pixels.
   * @default 240
   */
  size?: number;
  /**
   * The inline size of the sidebar while it is closed, in pixels.
   * @default 32
   */
  closedSize?: number;
  /**
   * The side the sidebar is placed on. Anchors the content to that edge while
   * the inline size animates, and picks the keyboard shortcut: `start` is
   * toggled by `[`, `end` by `]`.
   * @default 'start'
   */
  placement?: SidebarPropPlacement;
  /**
   * If `true`, the `[` / `]` keyboard shortcut is disabled.
   * @default false
   */
  disableKeyboardShortcut?: boolean;
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** The props used for each slot inside. */
  slotProps?: {
    transition?: Partial<TransitionProps<HTMLElement>>;
  };
};
