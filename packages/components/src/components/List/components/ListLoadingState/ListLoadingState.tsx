'use client';

import type { ReactNode } from 'react';

import { clsx, useInfiniteScroll } from '@koobiq/react-core';

import { utilClasses } from '../../../../styles/utility';
import { isPrimitiveNode } from '../../../../utils';
import { ProgressSpinner } from '../../../ProgressSpinner';
import { Typography } from '../../../Typography';

import s from './ListLoadingState.module.css';

const { listItem } = utilClasses;

export type ListLoadingStateProps = {
  /** The load more spinner to render when loading additional items. */
  isLoading?: boolean;
  /** Handler that is called when more items should be loaded, e.g. while scrolling near the bottom. */
  onLoadMore?: () => void;
  /** Content to display when items are loading. */
  loadingText?: ReactNode;
};

export function ListLoadingState(props: ListLoadingStateProps) {
  const { isLoading, onLoadMore, loadingText } = props;

  const isEnabled = !!onLoadMore;

  const { loadMoreRef } = useInfiniteScroll({
    fetchData: onLoadMore,
    hasMore: isLoading,
    isEnabled,
  });

  if (!isLoading) return null;

  return isPrimitiveNode(loadingText) ? (
    <li className={clsx(s.base, listItem)} ref={loadMoreRef}>
      <ProgressSpinner aria-label={String(loadingText)} />
      <Typography>{loadingText}</Typography>
    </li>
  ) : (
    loadingText
  );
}
