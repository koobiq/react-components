'use client';

import { mergeProps } from '@koobiq/react-core';
import { Collection, useIsHidden } from '@koobiq/react-primitives';

import { ListInner } from '../List';
import type { ListInnerProps } from '../List';
import { PopoverInner } from '../Popover/PopoverInner';

import s from './TagAutocomplete.module.css';
import { useTagAutocompleteListContext } from './TagAutocompleteListContext';
import type { TagAutocompleteListProps } from './types';

const MIN_POPOVER_WIDTH = 200;

export function TagAutocompleteList<T extends object = any>(
  props: TagAutocompleteListProps<T>
) {
  const isHidden = useIsHidden();

  if (isHidden) {
    return <Collection {...props} />;
  }

  return <TagAutocompleteListPopover {...props} />;
}

function TagAutocompleteListPopover<T extends object = any>(
  props: TagAutocompleteListProps<T>
) {
  const {
    isLoading,
    loadingText,
    noItemsText,
    onLoadMore,
    className,
    style,
    slotProps,
  } = props;

  const autocomplete = useTagAutocompleteListContext<T>();

  if (!autocomplete) {
    return null;
  }

  const { listProps: listPropsAria, popoverProps: popoverPropsAria } =
    autocomplete;

  if (!listPropsAria.state || !popoverPropsAria.state) {
    return null;
  }

  const popoverProps = mergeProps<any>(
    {
      offset: 4,
      hideArrow: true,
      maxBlockSize: 256,
      className: s.popover,
      placement: 'bottom start',
      size: Math.max(autocomplete.anchorWidth, MIN_POPOVER_WIDTH),
      slotProps: {
        backdrop: { hidden: true },
        container: { className: s.container },
      },
    },
    popoverPropsAria,
    slotProps?.popover
  );

  const listProps = mergeProps<
    [
      ListInnerProps<T>,
      typeof listPropsAria,
      Omit<ListInnerProps<T>, 'state' | 'children'> | undefined,
    ]
  >(
    {
      isLoading,
      onLoadMore,
      loadingText,
      noItemsText,
      isPadded: true,
      className: s.list,
      style,
    } as ListInnerProps<T>,
    listPropsAria,
    slotProps?.list
  );

  return (
    <PopoverInner
      {...popoverProps}
      className={className ?? popoverProps.className}
    >
      <ListInner<T> {...listProps} />
    </PopoverInner>
  );
}
