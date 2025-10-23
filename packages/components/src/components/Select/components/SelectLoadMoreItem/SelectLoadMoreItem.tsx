'use client';

import {
  clsx,
  useInfiniteScroll,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';

import { utilClasses } from '../../../../styles/utility';
import { ProgressSpinner } from '../../../ProgressSpinner';
import { Typography } from '../../../Typography';
import intlMessages from '../../intl';

import s from './SelectLoadMoreItem.module.css';

const { listItem } = utilClasses;

export type SelectLoadMoreItemProps = {
  /** The load more spinner to render when loading additional items. */
  isLoading?: boolean;
  /** Handler that is called when more items should be loaded, e.g. while scrolling near the bottom. */
  onLoadMore?: () => void | Promise<void>;
};

export function SelectLoadMoreItem(props: SelectLoadMoreItemProps) {
  const { isLoading, onLoadMore } = props;

  const t = useLocalizedStringFormatter(intlMessages);
  const loadMoreText = t.format('load more');
  const isEnabled = !!onLoadMore;

  const { loadMoreRef } = useInfiniteScroll({
    fetchData: onLoadMore,
    hasMore: isLoading,
    isEnabled,
  });

  return isLoading ? (
    <li className={clsx(s.base, listItem)} ref={loadMoreRef}>
      <ProgressSpinner aria-label={loadMoreText} />
      <Typography>{loadMoreText}</Typography>
    </li>
  ) : null;
}
