'use client';

import type { CSSProperties, ReactNode } from 'react';

export type LoadMoreItemProps = {
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
  /** The load more spinner to render when loading additional items. */
  isLoading: boolean;
  /** Handler that is called when more items should be loaded, e.g. while scrolling near the bottom. */
  onLoadMore: () => void;
  children?: ReactNode;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function LoadMoreItem(_props: LoadMoreItemProps) {
  return null;
}

LoadMoreItem.getCollectionNode = function* getCollectionNode(
  props: LoadMoreItemProps
) {
  const rendered = props.children;

  yield {
    type: 'loadMoreItem',
    rendered,
    props,
  };
};
