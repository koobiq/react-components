'use client';

import { forwardRef, useRef } from 'react';
import type { Ref } from 'react';

import { mergeProps, useElementSize } from '@koobiq/react-core';
import {
  useTagAutocomplete,
  useTagAutocompleteState,
} from '@koobiq/react-primitives';

import { useForm } from '../Form';
import type { ListInnerProps } from '../List';
import { ListInner } from '../List';
import { PopoverInner } from '../Popover/PopoverInner';
import { TagInputField } from '../TagInput/TagInput';

import s from './TagAutocomplete.module.css';
import type {
  TagAutocompleteComponent,
  TagAutocompleteProps,
  TagAutocompleteRef,
} from './types';

const MIN_POPOVER_INLINE_SIZE = 200;

type TagAutocompleteInnerProps<T extends object> = {
  props: TagAutocompleteProps<T>;
  inputRef?: Ref<TagAutocompleteRef>;
};

function TagAutocompleteInner<T extends object>(
  rootProps: TagAutocompleteInnerProps<T>
) {
  const { props, inputRef } = rootProps;
  const { list, isOpen, defaultOpen, onOpenChange, ...tagInputProps } = props;

  const { isDisabled: formIsDisabled, isReadOnly: formIsReadOnly } = useForm();
  const isDisabled = tagInputProps.isDisabled ?? formIsDisabled;
  const isReadOnly = tagInputProps.isReadOnly ?? formIsReadOnly;

  const { ref: anchorRef, width: anchorWidth } =
    useElementSize<HTMLDivElement>();

  const popoverRef = useRef<HTMLDivElement>(null);
  const listBoxRef = useRef<HTMLUListElement>(null);

  const autocompleteProps = {
    items: tagInputProps.items,
    children: tagInputProps.children,
    disabledKeys: tagInputProps.disabledKeys,
    selectedKeys: tagInputProps.selectedKeys,
    defaultSelectedKeys: tagInputProps.defaultSelectedKeys,
    onSelectionChange: tagInputProps.onSelectionChange,
    suggestionItems: list.items,
    suggestionChildren: list.renderItem,
    defaultFilter: list.defaultFilter,
    inputValue: tagInputProps.inputValue,
    defaultInputValue: tagInputProps.defaultInputValue,
    onInputChange: tagInputProps.onInputChange,
    onAdd: tagInputProps.onAdd,
    isDisabled,
    isReadOnly,
    isOpen,
    defaultOpen,
    onOpenChange,
    anchorRef,
    popoverRef,
    listBoxRef,
  };

  const autocompleteState = useTagAutocompleteState<T>(autocompleteProps);

  const {
    tagFieldProps,
    popoverProps: popoverPropsAria,
    listProps: listPropsAria,
  } = useTagAutocomplete<T>(autocompleteProps, autocompleteState);

  const popoverProps = mergeProps<any>(
    {
      offset: 4,
      hideArrow: true,
      maxBlockSize: 256,
      className: s.popover,
      placement: 'bottom start',
      size: Math.max(anchorWidth, MIN_POPOVER_INLINE_SIZE),
      slotProps: {
        backdrop: { hidden: true },
        container: { className: s.container },
      },
    },
    popoverPropsAria,
    list.slotProps?.popover
  );

  const listProps = mergeProps<
    [
      ListInnerProps<T>,
      typeof listPropsAria,
      Omit<ListInnerProps<T>, 'state' | 'children' | 'listRef'> | undefined,
    ]
  >(
    {
      isLoading: list.isLoading,
      onLoadMore: list.onLoadMore,
      loadingText: list.loadingText,
      noItemsText: list.noItemsText,
      isPadded: true,
      className: s.list,
      style: list.style,
    } as ListInnerProps<T>,
    listPropsAria,
    list.slotProps?.list
  );

  return (
    <>
      <TagInputField
        {...tagFieldProps}
        inputRef={inputRef}
        props={{
          ...tagInputProps,
          slotProps: {
            ...tagInputProps.slotProps,
            group: { ...tagInputProps.slotProps?.group, ref: anchorRef },
          },
        }}
      />
      <PopoverInner
        {...popoverProps}
        className={list.className ?? popoverProps.className}
      >
        <ListInner<T> {...listProps} />
      </PopoverInner>
    </>
  );
}

function TagAutocompleteRender<T extends object>(
  props: TagAutocompleteProps<T>,
  ref?: Ref<TagAutocompleteRef>
) {
  return <TagAutocompleteInner props={props} inputRef={ref} />;
}

export const TagAutocompleteRoot = forwardRef(
  TagAutocompleteRender
) as TagAutocompleteComponent;
