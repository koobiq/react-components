import type { ElementType, HTMLAttributes } from 'react';

import type { SeparatorProps } from '@koobiq/react-primitives';

export const dividerPropDisplay = ['block', 'inline', 'inlineBlock'] as const;

export type DividerPropDisplay = (typeof dividerPropDisplay)[number];

export type DividerProps = {
  /** Additional CSS-classes. */
  className?: string;
  /** Set the display for the component. */
  display?: DividerPropDisplay;
  /**
   * Indicates if the divider is a child of a flex container.
   * Mainly used for vertical layout.
   * Used when the block does not have a fixed height.
   */
  flexItem?: boolean;
  /**
   * If `true`, it disables the default paddings.
   */
  disablePaddings?: boolean;
  as?: ElementType;
} & Omit<SeparatorProps, 'elementType'> &
  HTMLAttributes<HTMLElement>;
