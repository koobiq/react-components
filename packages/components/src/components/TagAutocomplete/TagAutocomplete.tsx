'use client';

import { forwardRef, useRef } from 'react';
import type { Ref } from 'react';

import { mergeProps, useElementSize } from '@koobiq/react-core';
import {
  useTagAutocomplete,
  useTagAutocompleteState,
} from '@koobiq/react-primitives';

import { useForm } from '../Form';
import { ListInner } from '../List';
import { PopoverInner } from '../Popover/PopoverInner';
import { TagInputInner } from '../TagInput';
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
    caption,
    isLabelHidden,
    fullWidth,
    variant,
    labelPlacement,
    labelAlign,
    className,
    style,
    'data-testid': dataTestId,
    slotProps,
    isLoading,
    onLoadMore,
    loadingText,
    noItemsText,
    isDisabled: isDisabledProp,
    isReadOnly: isReadOnlyProp,
    ...restProps
  } = props;

  const { isDisabled: formIsDisabled, isReadOnly: formIsReadOnly } = useForm();

  const tagAutocompleteProps = {
    ...restProps,
    isDisabled: isDisabledProp ?? formIsDisabled,
    isReadOnly: isReadOnlyProp ?? formIsReadOnly,
  };

  const tagInputUIProps = {
    caption,
    isLabelHidden,
    fullWidth,
    variant,
    labelPlacement,
    labelAlign,
    className,
    style,
    'data-testid': dataTestId,
  };

  const { ref: anchorRef, width: anchorWidth } =
    useElementSize<HTMLDivElement>();

  const popoverRef = useRef<HTMLDivElement>(null);
  const listBoxRef = useRef<HTMLUListElement>(null);

  const autocompleteState = useTagAutocompleteState<T>(tagAutocompleteProps);

  const {
    tagFieldProps,
    listProps: listPropsAria,
    popoverProps: popoverPropsAria,
  } = useTagAutocomplete<T>(
    {
      ...tagAutocompleteProps,
      anchorRef,
      popoverRef,
      listBoxRef,
    },
    autocompleteState
  );

  const {
    tagInput: tagInputSlot,
    popover: popoverSlot,
    list: listSlot,
  } = slotProps ?? {};

  const { slotProps: tagInputSlotProps, ...otherTagInputSlot } =
    tagInputSlot ?? {};

  const tagInputProps = mergeProps(
    tagFieldProps,
    tagInputUIProps,
    otherTagInputSlot
  );

  const popoverProps = mergeProps(
    {
      offset: 4,
      hideArrow: true,
      maxBlockSize: 256,
      className: s.popover,
      'data-slot': 'dropdown',
      placement: 'bottom start' as const,
      size: Math.max(anchorWidth, MIN_POPOVER_INLINE_SIZE),
      slotProps: {
        backdrop: { hidden: true },
        container: { className: s.container },
      },
    },
    popoverPropsAria,
    popoverSlot
  );

  const listProps = mergeProps(
    {
      isLoading,
      onLoadMore,
      loadingText,
      isPadded: true,
      className: s.list,
      noItemsText: props.allowsEmptyCollection ? noItemsText : null,
    },
    listPropsAria,
    listSlot
  );

  return (
    <>
      <TagInputInner<T>
        {...tagInputProps}
        inputRef={ref}
        slotProps={{
          ...tagInputSlotProps,
          group: mergeProps(tagInputSlotProps?.group, {
            ref: anchorRef,
          }),
        }}
      />
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
