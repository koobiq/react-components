import type { ReactNode } from 'react';

export const dividerPropDisplay = ['block', 'inline', 'inlineBlock'] as const;

export const dividerPropOrientation = ['horizontal', 'vertical'] as const;

export type DividerPropOrientation = (typeof dividerPropOrientation)[number];
export type DividerPropDisplay = (typeof dividerPropDisplay)[number];

export type DividerBaseProps = {
  /** The content of the component. */
  children?: ReactNode;
  /** Additional CSS-classes. */
  className?: string;
  /**
   * The orientation of the separator.
   * @default 'horizontal'
   */
  orientation?: DividerPropOrientation;
  /** Set the display for the component. */
  display?: DividerPropDisplay;
  /**
   * Indicates if the divider is a child of a flex container.
   * Mainly used for vertical layout.
   * Used when the block does not have a fixed height.
   */
  flexItem?: boolean;
};
