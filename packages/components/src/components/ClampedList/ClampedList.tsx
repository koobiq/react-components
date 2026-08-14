'use client';

import { useMemo } from 'react';

import {
  clsx,
  mergeProps,
  useControlledState,
  useId,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';
import { IconChevronDown16, IconChevronUp16 } from '@koobiq/react-icons';
import {
  Button as ButtonPrimitive,
  composeRenderProps,
} from '@koobiq/react-primitives';

import s from './ClampedList.module.css';
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

  const toggleProps = mergeProps({ onPress: onToggle }, slotProps?.toggle);

  return (
    <div
      className={s.base}
      data-expanded={isExpanded || undefined}
      data-clamped={(hasToggle && !isExpanded) || undefined}
    >
      <div {...contentProps}>{children(state)}</div>
      {hasToggle && (
        <ButtonPrimitive
          {...toggleProps}
          type="button"
          className={composeRenderProps(
            slotProps?.toggle?.className,
            (className) => clsx(s.toggle, className)
          )}
          aria-controls={contentId}
          aria-expanded={isExpanded}
        >
          {isExpanded ? (
            <IconChevronUp16 aria-hidden />
          ) : (
            <IconChevronDown16 aria-hidden />
          )}
          <span>
            {isExpanded
              ? (lessText ?? strings.format('collapse'))
              : (moreText ??
                strings.format('show more', {
                  count: hiddenItemCount,
                }))}
          </span>
        </ButtonPrimitive>
      )}
    </div>
  );
}
