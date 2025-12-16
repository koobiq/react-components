import type { ReactElement } from 'react';

import type { AriaBreadcrumbsProps } from '@koobiq/react-primitives';

import type { BreadcrumbItemProps } from './components';

export type BreadcrumbsProps = AriaBreadcrumbsProps & {
  children: Array<ReactElement<BreadcrumbItemProps>>;
};
