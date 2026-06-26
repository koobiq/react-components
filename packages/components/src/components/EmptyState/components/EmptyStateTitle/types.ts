import type { ElementType, ReactNode } from 'react';

import type { DataAttributeProps } from '@koobiq/react-core';

export type EmptyStateTitleProps = {
  /**
   * The HTML element to render as.
   * @default 'h3'
   */
  as?: ElementType;
  /** Additional CSS-classes. */
  className?: string;
  /** The content of the title. */
  children?: ReactNode;
} & DataAttributeProps;
