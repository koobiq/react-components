import type { ComponentRef, ReactElement } from 'react';

import type { AriaBreadcrumbsProps } from '@koobiq/react-primitives';

import type { BreadcrumbItemProps } from './components';

export const breadcrumbsPropSize = ['compact', 'normal', 'big'] as const;

export type BreadcrumbsPropSize = (typeof breadcrumbsPropSize)[number];

export type BreadcrumbsProps = AriaBreadcrumbsProps & {
  /** The contents of the collection. */
  children: Array<ReactElement<BreadcrumbItemProps>>;
  /**
   * Size.
   * @default 'compact'
   */
  size?: BreadcrumbsPropSize;
};

export type BreadcrumbsRef = ComponentRef<'nav'>;
