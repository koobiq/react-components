import type { ReactNode } from 'react';

import type { AriaBreadcrumbItemProps } from '@koobiq/react-primitives';

export type BreadcrumbItemBaseProps = Omit<
  AriaBreadcrumbItemProps,
  'children'
> & {
  /** Icon placed before the children. */
  startAddon?: ReactNode;
  /** Icon placed after the children. */
  endAddon?: ReactNode;
  children?: ReactNode;
};
