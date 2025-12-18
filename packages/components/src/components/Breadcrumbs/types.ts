import type { ComponentRef, ReactElement, ReactNode } from 'react';

import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';
import type { AriaBreadcrumbsProps } from '@koobiq/react-primitives';

import type { BreadcrumbItemProps } from './components';

export const breadcrumbsPropSize = ['compact', 'normal', 'big'] as const;

export type BreadcrumbsPropSize = (typeof breadcrumbsPropSize)[number];

export type BreadcrumbsProps = ExtendableComponentPropsWithRef<
  AriaBreadcrumbsProps & {
    /** The contents of the collection. */
    children?: Array<ReactElement<BreadcrumbItemProps>>;
    /**
     * Size.
     * @default 'normal'
     */
    size?: BreadcrumbsPropSize;
    /**
     * The separator between each breadcrumb. It is a " / " by default.
     */
    separator?: ReactNode;
  },
  'nav'
>;

export type BreadcrumbsRef = ComponentRef<'nav'>;
