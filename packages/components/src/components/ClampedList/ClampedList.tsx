'use client';

import { useMemo, type ReactNode } from 'react';

import { once } from '@koobiq/logger';
import {
  mergeProps,
  useControlledState,
  useId,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';
import { IconChevronDown16, IconChevronUp16 } from '@koobiq/react-icons';

import s from './ClampedList.module.css';
import { ClampedListTrigger } from './components';
import intlMessages from './intl';
import type { ClampedListProps, ClampedListState } from './types';

const DEFAULT_COLLAPSED_VISIBLE_COUNT = 10;
const DEFAULT_HIDDEN_THRESHOLD = 6;

/**
 * ClampedList limits the visible portion of a collection and lets the user
 * expand or collapse it without prescribing the collection markup.
 */
export function ClampedList<T>({
  items,
  children,
  collapsedVisibleCount = DEFAULT_COLLAPSED_VISIBLE_COUNT,
  hiddenThreshold = DEFAULT_HIDDEN_THRESHOLD,
  isExpanded: isExpandedProp,
  defaultExpanded,
  onExpandedChange,
  moreText,
  lessText,
  slotProps,
}: ClampedListProps<T>) {
  const allItems = useMemo(() => Array.from(items), [items]);
  const generatedContentId = useId();
  const contentId = slotProps?.content?.id ?? generatedContentId;
  const strings = useLocalizedStringFormatter(intlMessages);

  const normalizedCollapsedVisibleCount = Number.isFinite(collapsedVisibleCount)
    ? Math.max(0, Math.trunc(collapsedVisibleCount))
    : DEFAULT_COLLAPSED_VISIBLE_COUNT;

  const normalizedHiddenThreshold = Number.isFinite(hiddenThreshold)
    ? Math.max(1, Math.trunc(hiddenThreshold))
    : DEFAULT_HIDDEN_THRESHOLD;

  if (
    process.env.NODE_ENV !== 'production' &&
    (!Number.isInteger(collapsedVisibleCount) || collapsedVisibleCount < 0)
  ) {
    once.warn(
      'ClampedList: the "collapsedVisibleCount" prop must be a non-negative integer. The received value was normalized.'
    );
  }

  if (
    process.env.NODE_ENV !== 'production' &&
    (!Number.isInteger(hiddenThreshold) || hiddenThreshold < 1)
  ) {
    once.warn(
      'ClampedList: the "hiddenThreshold" prop must be a positive integer. The received value was normalized.'
    );
  }

  const [preferredExpanded, setPreferredExpanded] = useControlledState(
    isExpandedProp,
    defaultExpanded ?? false,
    onExpandedChange
  );

  const hiddenItemCount = Math.max(
    allItems.length - normalizedCollapsedVisibleCount,
    0
  );

  const hasToggle =
    hiddenItemCount > 0 && hiddenItemCount >= normalizedHiddenThreshold;

  const isExpanded = !hasToggle || preferredExpanded;

  const visibleItems = useMemo(
    () =>
      isExpanded
        ? allItems
        : allItems.slice(0, normalizedCollapsedVisibleCount),
    [allItems, isExpanded, normalizedCollapsedVisibleCount]
  );

  const state = useMemo<ClampedListState<T>>(
    () => ({ visibleItems, hiddenItemCount, isExpanded }),
    [visibleItems, hiddenItemCount, isExpanded]
  );

  const onToggle = () => setPreferredExpanded(!preferredExpanded);

  const contentProps = mergeProps(
    { className: s.content },
    slotProps?.content,
    { id: contentId, role: 'group' }
  );

  const { icon: iconProp, ...toggleSlotProps } = slotProps?.toggle ?? {};

  let toggleIcon: ReactNode;

  if (iconProp === undefined) {
    toggleIcon = isExpanded ? <IconChevronUp16 /> : <IconChevronDown16 />;
  } else if (typeof iconProp === 'function') {
    toggleIcon = iconProp(isExpanded);
  } else {
    toggleIcon = iconProp;
  }

  const toggleProps = mergeProps(
    {
      'aria-controls': contentId,
      'aria-expanded': isExpanded,
      onPress: onToggle,
    },
    toggleSlotProps,
    {
      children: isExpanded
        ? (lessText ?? strings.format('collapse'))
        : (moreText ??
          strings.format('show more', {
            count: hiddenItemCount,
          })),
      icon: toggleIcon,
    }
  );

  return (
    <div
      className={s.base}
      data-expanded={isExpanded || undefined}
      data-clamped={(hasToggle && !isExpanded) || undefined}
    >
      <div {...contentProps}>{children(state)}</div>
      {hasToggle && <ClampedListTrigger {...toggleProps} />}
    </div>
  );
}
