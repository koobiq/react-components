import type { CSSProperties } from 'react';

import type { DataAttributeProps } from '@koobiq/react-core';

export type DropdownMenuSeparatorProps = {
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
} & DataAttributeProps;
