import type { ReactElement } from 'react';

import type { AriaBreadcrumbsProps } from '@koobiq/react-primitives';

import type { BreadcrumbItemProps } from './components';

export const breadcrumbsPropSize = ['compact', 'normal', 'big'] as const;

export type BreadcrumbsPropSize = (typeof breadcrumbsPropSize)[number];

export type BreadcrumbsProps = AriaBreadcrumbsProps & {
  children: Array<ReactElement<BreadcrumbItemProps>>;
  size?: BreadcrumbsPropSize;
};
