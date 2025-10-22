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

import s from './SelectLoadMore.module.css';

const { listFooter } = utilClasses;

export type SelectLoadMoreProps = {
  /** The load more spinner to render when loading additional items. */
  isLoading?: boolean;
  /** Handler that is called when more items should be loaded, e.g. while scrolling near the bottom. */
  onLoadMore?: () => void | Promise<void>;
};

export function SelectLoadMore(props: SelectLoadMoreProps) {
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
    <section className={clsx(s.base, listFooter)} ref={loadMoreRef}>
      <ProgressSpinner aria-label={loadMoreText} />
      <Typography>{loadMoreText}</Typography>
    </section>
  ) : null;
}
