'use client';

import { clsx, mergeProps, useDOMRef } from '@koobiq/react-core';
import { useTagList } from '@koobiq/react-primitives';

import { TagItem } from './components';
import groupStyles from './TagList.module.css';
import type { TagListInnerProps } from './types';

export function TagListInner<T extends object>(props: TagListInnerProps<T>) {
  const {
    variant = 'theme-fade',
    style,
    state,
    onRemove,
    className,
    isDisabled,
    slotProps,
    autoFocus,
    tagListRef,
    escapeKeyBehavior,
    'aria-label': ariaLabel,
    'data-testid': dataTestid,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
  } = props;
  const domRef = useDOMRef(tagListRef);

  const { gridProps } = useTagList(
    { escapeKeyBehavior, autoFocus },
    state,
    domRef
  );

  const collectionId = (gridProps as Record<string, unknown>)[
    'data-collection'
  ] as string | undefined;

  const rootProps = mergeProps(
    {
      style,
      ref: domRef,
      className: clsx(groupStyles.base, className),
      'data-testid': dataTestid,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'data-disabled': isDisabled || undefined,
    },
    gridProps,
    slotProps?.root
  );

  return (
    <div {...rootProps}>
      {[...state.collection].map((item) => (
        <TagItem
          item={item}
          state={state}
          key={item.key}
          variant={variant}
          onRemove={onRemove}
          isDisabled={isDisabled}
          collectionId={collectionId}
        />
      ))}
    </div>
  );
}
