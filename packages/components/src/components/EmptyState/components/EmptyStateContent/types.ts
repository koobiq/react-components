import type { ElementType, ReactNode } from 'react';

import type { DataAttributeProps } from '@koobiq/react-core';

export type EmptyStateContentProps = {
  /**
   * The HTML element to render as.
   * @default 'p'
   */
  as?: ElementType;
  /** Additional CSS-classes. */
  className?: string;
  /** The content of the text. */
  children?: ReactNode;
} & DataAttributeProps;
