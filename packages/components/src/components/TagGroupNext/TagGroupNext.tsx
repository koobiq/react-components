'use client';

import { forwardRef, useMemo } from 'react';
import type { FocusEvent, RefObject, Ref } from 'react';

import { clsx, mergeProps, useDOMRef, useLocale } from '@koobiq/react-core';
import {
  ListKeyboardDelegate,
  useListState,
  useSelectableList,
} from '@koobiq/react-primitives';

import { TagItem } from './components';
import { Tag } from './Tag';
import groupStyles from './TagGroupNext.module.css';
import type { TagGroupNextComponent, TagGroupNextProps } from './types';

function TagGroupNextRender<T extends object>(
  props: TagGroupNextProps<T>,
  ref?: Ref<HTMLDivElement>
) {
  const {
    variant = 'theme-fade',
    style,
    className,
    slotProps,
    onRemove,
    escapeKeyBehavior,
  } = props;
  const domRef = useDOMRef(ref);
  const state = useListState(props);
  const { direction } = useLocale();

  const keyboardDelegate = useMemo(
    () =>
      new ListKeyboardDelegate({
        collection: state.collection,
        direction,
        disabledBehavior: state.selectionManager.disabledBehavior,
        disabledKeys: state.disabledKeys,
        orientation: 'horizontal',
        ref: domRef as RefObject<HTMLDivElement | null>,
      }),
    [
      domRef,
      direction,
      state.collection,
      state.disabledKeys,
      state.selectionManager.disabledBehavior,
    ]
  );

  const { listProps } = useSelectableList({
    keyboardDelegate,
    shouldFocusWrap: true,
    escapeKeyBehavior,
    collection: state.collection,
    disabledKeys: state.disabledKeys,
    selectionManager: state.selectionManager,
    ref: domRef as RefObject<HTMLDivElement | null>,
  });

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    const nextFocusedElement = event.relatedTarget;

    if (
      nextFocusedElement instanceof Node &&
      event.currentTarget.contains(nextFocusedElement)
    ) {
      return;
    }

    state.selectionManager.clearSelection();
  };

  const collectionId = (listProps as Record<string, unknown>)[
    'data-collection'
  ] as string | undefined;

  const rootProps = mergeProps(
    {
      style,
      ref: domRef,
      onBlur: handleBlur,
      className: clsx(groupStyles.base, className),
      role: state.collection.size ? 'grid' : 'group',
    },
    listProps,
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
          collectionId={collectionId}
        />
      ))}
    </div>
  );
}

const TagGroupNextComponent = forwardRef(
  TagGroupNextRender
) as TagGroupNextComponent;

type CompoundedComponent = typeof TagGroupNextComponent & {
  Tag: typeof Tag;
};

export const TagGroupNext = TagGroupNextComponent as CompoundedComponent;

TagGroupNext.Tag = Tag;
