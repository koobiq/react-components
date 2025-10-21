'use client';

import { clsx, type Node, useInfiniteScroll } from '@koobiq/react-core';

import { utilClasses } from '../../../../styles/utility';
import type { LoadMoreItemProps } from '../../../Collections';

const { listFooter } = utilClasses;

export type SelectLoadMoreItemProps<T> = {
  item: Node<T>;
};

export function SelectLoadMoreItem<T>({ item }: SelectLoadMoreItemProps<T>) {
  const { rendered, props } = item;

  const { isLoading, onLoadMore, className, style }: LoadMoreItemProps = props;

  const { loadMoreRef } = useInfiniteScroll(onLoadMore, isLoading);

  return isLoading ? (
    <section
      className={clsx(listFooter, className)}
      style={style}
      ref={loadMoreRef}
    >
      {rendered}
    </section>
  ) : null;
}
