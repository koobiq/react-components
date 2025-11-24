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
  /** Root element for the observer (default: viewport). */
  root?: Element | Document | null;
  /** Dependencies that should recreate the observer when changed. */
  observeDeps?: unknown[];
};

export function ListLoadingState(props: ListLoadingStateProps) {
  const { isLoading, onLoadMore, loadingText, root, observeDeps } = props;

  const isEnabled = !!onLoadMore;

  const { loadMoreRef } = useInfiniteScroll({
    fetchData: onLoadMore,
    hasMore: isLoading,
    observeDeps,
    isEnabled,
    root,
  });

  if (!isLoading) return null;

  return (
    <>
      <li style={{ position: 'relative', width: 0, height: 0 }}>
        <div
          ref={loadMoreRef}
          style={{ position: 'absolute', height: 1, width: 1 }}
        />
      </li>
      <li>
        {isPrimitiveNode(loadingText) ? (
          <div className={clsx(s.base, listItem)}>
            <ProgressSpinner aria-label={String(loadingText)} />
            <Typography>{loadingText}</Typography>
          </div>
        ) : (
          loadingText
        )}
      </li>
    </>
  );
}
