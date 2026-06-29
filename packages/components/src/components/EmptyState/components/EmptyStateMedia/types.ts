import type { ElementType, ReactNode } from 'react';

import type { DataAttributeProps } from '@koobiq/react-core';

export type EmptyStateMediaProps = {
  /**
   * The HTML element to render as.
   * @default 'div'
   */
  as?: ElementType;
  /** Additional CSS-classes. */
  className?: string;
  /** The content of the slot. */
  children?: ReactNode;
} & DataAttributeProps;
