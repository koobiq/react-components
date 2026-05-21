'use client';

import { forwardRef } from 'react';
import type { Ref } from 'react';

import { useListState } from '@koobiq/react-primitives';

import { Tag } from './Tag';
import { TagListInner } from './TagListInner';
import type { TagListComponent, TagListProps } from './types';

function TagListRender<T extends object>(
  props: TagListProps<T>,
  ref?: Ref<HTMLDivElement>
) {
  const {
    style,
    variant,
    onRemove,
    autoFocus,
    className,
    slotProps,
    escapeKeyBehavior,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'data-testid': dataTestid,
  } = props;

  const state = useListState(props);

  return (
    <TagListInner
      state={state}
      style={style}
      tagListRef={ref}
      variant={variant}
      onRemove={onRemove}
      autoFocus={autoFocus}
      className={className}
      slotProps={slotProps}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      escapeKeyBehavior={escapeKeyBehavior}
      data-testid={dataTestid}
    />
  );
}

const TagListComponent = forwardRef(TagListRender) as TagListComponent;

type CompoundedComponent = typeof TagListComponent & {
  Tag: typeof Tag;
};

export const TagList = TagListComponent as CompoundedComponent;

TagList.Tag = Tag;
