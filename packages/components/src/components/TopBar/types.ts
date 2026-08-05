import type { ElementType, ReactNode } from 'react';

import type { DataAttributeProps } from '@koobiq/react-core';

export const topBarPropPosition = ['static', 'sticky'] as const;

export type TopBarPropPosition = (typeof topBarPropPosition)[number];

export type TopBarBaseProps = {
  /**
   * How the top bar is positioned on the page.
   * `sticky` pins it to the top of the nearest scrolling ancestor, `static`
   * keeps it in the flow.
   * @default 'sticky'
   */
  position?: TopBarPropPosition;
  /**
   * Whether to show the bottom shadow. The component never listens to scrolling
   * on its own — toggle this prop when the page is scrolled.
   */
  hasShadow?: boolean;
  /**
   * The HTML element to render as.
   * @default 'header'
   */
  as?: ElementType;
  /** Additional CSS-classes. */
  className?: string;
  /** The content of the top bar. */
  children?: ReactNode;
} & DataAttributeProps;
