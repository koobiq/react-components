import type { ElementType, ReactNode } from 'react';

import type { AriaLabelingProps, DataAttributeProps } from '@koobiq/react-core';

export const topBarContainerPropPlacement = ['start', 'end'] as const;

export type TopBarContainerPropPlacement =
  (typeof topBarContainerPropPlacement)[number];

export type TopBarContainerBaseProps = {
  /**
   * The side of the top bar the container is placed on.
   * @default 'start'
   */
  placement?: TopBarContainerPropPlacement;
  /**
   * Whether the container is a toolbar. Adds `role="toolbar"` and lets the user
   * move between the actions with the arrow keys. Give the container an
   * `aria-label` when it is a toolbar.
   */
  isToolbar?: boolean;
  /**
   * The HTML element to render as.
   * @default 'div'
   */
  as?: ElementType;
  /** Additional CSS-classes. */
  className?: string;
  /** The content of the container. */
  children?: ReactNode;
} & AriaLabelingProps &
  DataAttributeProps;
