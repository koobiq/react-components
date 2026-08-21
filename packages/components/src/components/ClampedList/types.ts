import type { ComponentPropsWithRef, ReactNode } from 'react';

import type { DataAttributeProps } from '@koobiq/react-core';

import type { ClampedListTriggerProps } from './components';

export type ClampedListState<T> = {
  /** Items currently exposed to the render function. */
  visibleItems: T[];
  /** Number of items that would be hidden in the collapsed state. */
  hiddenItemCount: number;
  /** Whether all items are currently visible. */
  isExpanded: boolean;
};

export type ClampedListProps<T> = {
  /** Collection of items managed by the component. */
  items: Iterable<T>;
  /** Renders the visible portion of the collection. */
  children: (state: ClampedListState<T>) => ReactNode;
  /**
   * Maximum number of visible items in the collapsed state.
   * @default 10
   */
  collapsedVisibleCount?: number;
  /**
   * Minimum number of hidden items required to render the toggle.
   * @default 6
   */
  hiddenThreshold?: number;
  /** Whether all items are visible. */
  isExpanded?: boolean;
  /**
   * Whether all items are visible by default.
   * @default false
   */
  defaultExpanded?: boolean;
  /** Handler called when the user toggles the expanded state. */
  onExpandedChange?: (isExpanded: boolean) => void;
  /** Content displayed in the toggle when the list is collapsed. */
  moreText?: ReactNode;
  /** Content displayed in the toggle when the list is expanded. */
  lessText?: ReactNode;
  /** The props used for each slot inside. */
  slotProps?: {
    content?: Omit<ComponentPropsWithRef<'div'>, 'children'> &
      DataAttributeProps;
    toggle?: Omit<ClampedListTriggerProps, 'children' | 'icon'> & {
      /**
       * Icon displayed before the toggle content. Pass `null` to hide it or a
       * render function to use the current expanded state.
       */
      icon?: ReactNode | ((isExpanded: boolean) => ReactNode);
    };
  };
};
