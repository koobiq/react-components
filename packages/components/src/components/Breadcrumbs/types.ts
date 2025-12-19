import type {
  ReactNode,
  ComponentRef,
  ReactElement,
  ComponentPropsWithRef,
} from 'react';

import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';
import type { AriaBreadcrumbsProps } from '@koobiq/react-primitives';

import type { BreadcrumbItemProps } from './components';

export const breadcrumbsPropSize = ['compact', 'normal', 'big'] as const;

export type BreadcrumbsPropSize = (typeof breadcrumbsPropSize)[number];

export type BreadcrumbRenderItem = {
  /** Original React element. */
  element: ReactElement<BreadcrumbItemProps>;
  /** Index in the `children` list. */
  index: number;
  /** Key. */
  key: string | number | null;
  /** Convenient access to the element's children. */
  children: ReactNode;
  /** Optional link target extracted from props. */
  href?: string;
  /** Element props shortcut. */
  props: BreadcrumbItemProps;
};

export type RenderEllipsisParams = {
  /** The collapsed items. */
  items: BreadcrumbRenderItem[];
  /** The default ellipsis icon. */
  ellipsisIcon: ReactElement;
  /** Index of the ellipsis in the visual list. */
  ellipsisIndex: number;
};

export type BreadcrumbsPropRenderEllipsis = (
  params: RenderEllipsisParams
) => ReactNode;

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
     * The separator between each breadcrumb.
     * @default " / "
     */
    separator?: ReactNode;
    /** Unique identifier for testing purposes. */
    'data-testid'?: string | number;
    /** The props used for each slot inside. */
    slotProps?: {
      list?: ComponentPropsWithRef<'ol'>;
      divider?: ComponentPropsWithRef<'span'>;
    };
    /** Where to render the ellipsis item (0..items.length). Default: end. */
    ellipsisIndex?: number;
    renderEllipsis?: BreadcrumbsPropRenderEllipsis;
  },
  'nav'
>;

export type BreadcrumbsRef = ComponentRef<'nav'>;
