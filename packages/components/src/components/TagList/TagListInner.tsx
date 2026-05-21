'use client';

import type { ComponentPropsWithRef, CSSProperties, Ref } from 'react';

import type { FocusStrategy, Key } from '@koobiq/react-core';
import { clsx, mergeProps, useDOMRef } from '@koobiq/react-core';
import type { ListState } from '@koobiq/react-primitives';

import { TagItem } from './components';
import { useTagList } from './hooks';
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
    variant = 'theme-fade',
    style,
    state,
    onRemove,
    className,
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
          collectionId={collectionId}
        />
      ))}
    </div>
  );
}
