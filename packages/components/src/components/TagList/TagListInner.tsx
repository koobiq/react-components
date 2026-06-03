'use client';

import { clsx, mergeProps, useDOMRef } from '@koobiq/react-core';
import { useTagList } from '@koobiq/react-primitives';

import { TagItem } from './components';
import groupStyles from './TagList.module.css';
import type { TagListInnerProps } from './types';

export function TagListInner<T extends object>(props: TagListInnerProps<T>) {
  const {
    variant = 'theme-fade',
    state,
    onRemove,
    className,
    isDisabled,
    autoFocus,
    tagListRef,
    escapeKeyBehavior,
    focusBehavior,
    ...rootDOMProps
  } = props;

  const domRef = useDOMRef(tagListRef);

  const { gridProps, collectionId } = useTagList(
    { escapeKeyBehavior, autoFocus },
    state,
    domRef
  );

  const rootProps = mergeProps(
    {
      ref: domRef,
      className: clsx(groupStyles.base, className),
      'data-disabled': isDisabled || undefined,
    },
    gridProps,
    rootDOMProps
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
          focusBehavior={focusBehavior}
        />
      ))}
    </div>
  );
}
