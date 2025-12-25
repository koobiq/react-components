import type { CSSProperties, ReactNode } from 'react';

import type { AriaBreadcrumbItemProps } from '@koobiq/react-primitives';

export type BreadcrumbItemBaseProps = Omit<
  AriaBreadcrumbItemProps,
  'children' | 'elementType'
> & {
  /** Icon placed before the children. */
  startAddon?: ReactNode;
  /** Icon placed after the children. */
  endAddon?: ReactNode;
  /** The content of the component. */
  children?: ReactNode;
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
};
