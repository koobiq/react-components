'use client';

import { forwardRef } from 'react';
import type { Ref } from 'react';

import { useTagListState } from '@koobiq/react-primitives';

import { Tag } from './Tag';
import { TagListInner } from './TagListInner';
import type { TagListComponent, TagListProps } from './types';

function TagListRender<T extends object>(
  props: TagListProps<T>,
  ref?: Ref<HTMLDivElement>
) {
  const state = useTagListState(props);

  return <TagListInner {...props} state={state} tagListRef={ref} />;
}

const TagListComponent = forwardRef(TagListRender) as TagListComponent;

type CompoundedComponent = typeof TagListComponent & {
  Tag: typeof Tag;
};

export const TagList = TagListComponent as CompoundedComponent;

TagList.Tag = Tag;
