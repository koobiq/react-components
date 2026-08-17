'use client';

import { useMemo, type ReactNode } from 'react';

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

/**
 * ClampedList limits the visible portion of a collection and lets the user
 * expand or collapse it without prescribing the collection markup.
 */
export function ClampedList<T>({
  items,
  children,
  collapsedVisibleCount = 10,
  hiddenThreshold = 6,
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

  const [preferredExpanded, setPreferredExpanded] = useControlledState(
    isExpandedProp,
    defaultExpanded ?? false,
    onExpandedChange
  );

  const hiddenItemCount = Math.max(allItems.length - collapsedVisibleCount, 0);
  const hasToggle = hiddenItemCount >= hiddenThreshold;
  const isExpanded = !hasToggle || preferredExpanded;

  const visibleItems = useMemo(
    () => (isExpanded ? allItems : allItems.slice(0, collapsedVisibleCount)),
    [allItems, collapsedVisibleCount, isExpanded]
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
