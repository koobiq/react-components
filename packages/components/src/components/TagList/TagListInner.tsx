'use client';

import { useMemo } from 'react';
import type {
  Ref,
  RefObject,
  CSSProperties,
  ComponentPropsWithRef,
} from 'react';

import type { FocusStrategy, Key } from '@koobiq/react-core';
import {
  clsx,
  useLocale,
  useDOMRef,
  mergeProps,
  useFocusWithin,
} from '@koobiq/react-core';
import type { ListState } from '@koobiq/react-primitives';
import {
  useSelectableList,
  ListKeyboardDelegate,
} from '@koobiq/react-primitives';

import { TagItem } from './components';
import groupStyles from './TagList.module.css';
import type { TagListPropVariant } from './types';

export type TagListInnerProps<T extends object> = {
  /** Pre-built collection state, e.g. from `useListState`. */
  state: ListState<T>;
  /**
   * The variant to use.
   * @default 'theme-fade'
   */
  variant?: TagListPropVariant;
  /** Handler that is called when a user deletes a tag. */
  onRemove?: (keys: Set<Key>) => void;
  /**
   * Whether pressing the Escape key should clear selection.
   * @default 'clearSelection'
   */
  escapeKeyBehavior?: 'clearSelection' | 'none';
  /** Auto-focus the first/last tag on mount. */
  autoFocus?: boolean | FocusStrategy;
  /** Ref to the root element. */
  tagListRef?: Ref<HTMLDivElement>;
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
  /** An accessibility label. */
  'aria-label'?: string;
  /** ID of an element that labels this collection. */
  'aria-labelledby'?: string;
  /** ID of an element that describes this collection. */
  'aria-describedby'?: string;
  /** The props used for each slot inside. */
  slotProps?: {
    root?: ComponentPropsWithRef<'div'>;
  };
};

export function TagListInner<T extends object>(props: TagListInnerProps<T>) {
  const {
    state,
    variant = 'theme-fade',
    style,
    className,
    slotProps,
    onRemove,
    escapeKeyBehavior,
    autoFocus,
    tagListRef,
  } = props;
  const domRef = useDOMRef(tagListRef);
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
    autoFocus,
    collection: state.collection,
    disabledKeys: state.disabledKeys,
    selectionManager: state.selectionManager,
    ref: domRef as RefObject<HTMLDivElement | null>,
  });

  // Clear selection when focus leaves the group.
  const { focusWithinProps } = useFocusWithin({
    onBlurWithin: () => state.selectionManager.clearSelection(),
  });

  const collectionId = (listProps as Record<string, unknown>)[
    'data-collection'
  ] as string | undefined;

  const rootProps = mergeProps(
    {
      style,
      ref: domRef,
      className: clsx(groupStyles.base, className),
      role: state.collection.size ? 'grid' : 'group',
    },
    listProps,
    focusWithinProps,
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
