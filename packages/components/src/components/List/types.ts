import type {
  Ref,
  ComponentRef,
  ReactElement,
  CSSProperties,
  ComponentPropsWithRef,
  ReactNode,
} from 'react';

import type { ExtendableProps } from '@koobiq/react-core';
import type { AriaListBoxProps } from '@koobiq/react-primitives';

import type { TypographyProps } from '../Typography';

export type ListProps<T> = ExtendableProps<
  {
    /** Additional CSS-classes. */
    className?: string;
    /** Inline styles. */
    style?: CSSProperties;
    /** Ref to the HTML ul-element. */
    ref?: Ref<HTMLElement>;
    /** The props used for each slot inside. */
    slotProps?: {
      label?: TypographyProps;
      list?: ComponentPropsWithRef<'div'>;
    };
    /** Whether the component has outer padding. */
    isPadded?: boolean;
    /** The load more spinner to render when loading additional items. */
    isLoading?: boolean;
    /** Handler that is called when more items should be loaded, e.g. while scrolling near the bottom. */
    onLoadMore?: () => void;
    /** Content to display when no items are available. */
    noItemsText?: ReactNode;
    /** Content to display when items are loading. */
    loadingText?: ReactNode;
    /** The contents of the collection. */
    children?: AriaListBoxProps<T>['children'];
  },
  Omit<AriaListBoxProps<T>, 'children'>
>;

export type ListRef = ComponentRef<'ul'>;

export type ListComponent = <T>(props: ListProps<T>) => ReactElement | null;
