'use client';

import { forwardRef, useRef } from 'react';
import type { Ref } from 'react';

import { mergeProps, useElementSize } from '@koobiq/react-core';
import {
  useTagAutocomplete,
  useTagAutocompleteState,
} from '@koobiq/react-primitives';

import { ListInner } from '../List';
import { PopoverInner } from '../Popover/PopoverInner';
import { TagInputInner } from '../TagInput';
import { useTagInputResolvedProps } from '../TagInput/utils';
import { Tag } from '../TagList/Tag';

import s from './TagAutocomplete.module.css';
import { TagAutocompleteListItem } from './TagAutocompleteItem';
import type { TagAutocompleteComponent, TagAutocompleteProps } from './types';

const MIN_POPOVER_INLINE_SIZE = 200;

function TagAutocompleteRender<T extends object>(
  props: TagAutocompleteProps<T>,
  ref?: Ref<HTMLInputElement>
) {
  const {
    listItems,
    renderListItem,
    defaultFilter,
    isOpen,
    defaultOpen,
    onOpenChange,
    ...tagInputProps
  } = props;

  const resolvedTagInputProps = useTagInputResolvedProps<T>(tagInputProps);

  const { ref: anchorRef, width: anchorWidth } =
    useElementSize<HTMLDivElement>();

  const popoverRef = useRef<HTMLDivElement>(null);
  const listBoxRef = useRef<HTMLUListElement>(null);

  const tagInputInnerProps = {
    ...resolvedTagInputProps,
    slotProps: {
      ...resolvedTagInputProps.slotProps,
      group: mergeProps(resolvedTagInputProps.slotProps?.group, {
        ref: anchorRef,
      }),
    },
  };

  const autocompleteState = useTagAutocompleteState<T>({
    ...resolvedTagInputProps,
    listItems,
    renderListItem,
    defaultFilter,
    isOpen,
    defaultOpen,
    onOpenChange,
    popoverRef,
    listBoxRef,
  });

  const {
    tagFieldProps,
    listProps: listPropsAria,
    popoverProps: popoverPropsAria,
  } = useTagAutocomplete<T, typeof tagInputInnerProps>(
    { anchorRef, tagFieldProps: tagInputInnerProps },
    autocompleteState
  );

  const popoverProps = mergeProps(
    {
      offset: 4,
      hideArrow: true,
      maxBlockSize: 256,
      className: s.popover,
      placement: 'bottom start' as const,
      size: Math.max(anchorWidth, MIN_POPOVER_INLINE_SIZE),
      slotProps: {
        backdrop: { hidden: true },
        container: { className: s.container },
      },
    },
    popoverPropsAria
  );

  const listProps = mergeProps(
    {
      isPadded: true,
      className: s.list,
    },
    listPropsAria
  );

  return (
    <>
      <TagInputInner<T> {...tagFieldProps} inputRef={ref} />
      <PopoverInner {...popoverProps}>
        <ListInner<T> {...listProps} />
      </PopoverInner>
    </>
  );
}

const TagAutocompleteComponent = forwardRef(
  TagAutocompleteRender
) as TagAutocompleteComponent;

type CompoundedComponent = typeof TagAutocompleteComponent & {
  ListItem: typeof TagAutocompleteListItem;
  Tag: typeof Tag;
};

export const TagAutocomplete = TagAutocompleteComponent as CompoundedComponent;

TagAutocomplete.ListItem = TagAutocompleteListItem;

TagAutocomplete.Tag = Tag;
