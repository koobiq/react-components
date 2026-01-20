import type { ComponentRef, ReactNode } from 'react';

export type ContentPanelSize = number;

export type ContentPanelProps = {
  children?: ReactNode;
  /** The width of the panel. */
  width?: ContentPanelSize | null;
  /** The minimum width of the panel. */
  minWidth?: ContentPanelSize | null;
  /** The maximum width of the panel. */
  maxWidth?: ContentPanelSize | null;
  /** The default width of the panel. */
  defaultWidth?: ContentPanelSize | null;
};

export type ContentPanelRef = ComponentRef<'div'>;
