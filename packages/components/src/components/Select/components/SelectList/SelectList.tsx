'use client';

import type { RefObject } from 'react';

import type { Node } from '@koobiq/react-core';
import {
  clsx,
  isNotNil,
  mergeProps,
  useObjectRef,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';
import {
  useListBox,
  // eslint-disable-next-line camelcase
  UNSTABLE_useFilteredListState,
} from '@koobiq/react-primitives';
import type {
  MultiSelectState,
  AutocompleteAria,
} from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';
import { Divider } from '../../../Divider';
import type { ListProps } from '../../../List';
import { ListEmptyState, ListLoadingState } from '../../../List/components';
import { SearchInput } from '../../../SearchInput';
import { Typography } from '../../../Typography';
import intlMessages from '../../intl';
import { SelectContext } from '../../SelectContext';
import type { SelectProps } from '../../types';
import { CollectionRoot } from '../../utils';

import s from './SelectList.module.css';

const { list } = utilClasses;

export type SelectListProps<T extends object> = {
  state: MultiSelectState<T>;
  listRef?: RefObject<HTMLElement | null>;
  inputRef?: RefObject<HTMLInputElement | null>;
  filterFn?: (nodeValue: string, node: Node<T>) => boolean;
  inputProps?: AutocompleteAria<T>['inputProps'];
  collectionRef?: RefObject<HTMLElement | null>;
} & Omit<ListProps<T>, 'ref' | 'children'> &
  Pick<SelectProps<T>, 'noItemsText' | 'isLoading' | 'onLoadMore'>;

export function SelectList<T extends object>(props: SelectListProps<T>) {
  const {
    label,
    className,
    style,
    filterFn,
    slotProps,
    state: inputState,
    isLoading,
    onLoadMore,
    inputProps,
    listRef,
    inputRef,
    collectionRef,
    noItemsText: noItemsTextProp,
    loadingText: loadingTextProp,
  } = props;

  const state = UNSTABLE_useFilteredListState?.(inputState, filterFn);

  const t = useLocalizedStringFormatter(intlMessages);

  const domRef = useObjectRef(listRef);

  const isEmpty = state.collection.size === 0;

  const { listBoxProps, labelProps } = useListBox(props, state, domRef);

  const titleProps = mergeProps(
    {
      className: s.label,
      variant: 'text-normal-strong',
    },
    slotProps?.label,
    labelProps
  );

  const listProps = mergeProps(
    {
      style,
      ref: domRef as RefObject<HTMLUListElement | null>,
      className: clsx(list, className),
      'data-padded': true,
    },
    slotProps?.list,
    listBoxProps
  );

  const noItemsText =
    noItemsTextProp === undefined ? t.format('empty items') : noItemsTextProp;

  const loadingText = loadingTextProp ?? t.format('loading');

  const { collection } = state;

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <SearchInput
        aria-label="search"
        variant="transparent"
        ref={inputRef}
        isLabelHidden
        autoFocus
        fullWidth
        {...inputProps}
      />
      <Divider disablePaddings />
      {isNotNil(label) && <Typography {...titleProps}>{label}</Typography>}
      <ul {...listProps}>
        <SelectContext.Provider value={state}>
          <CollectionRoot collection={collection} />
        </SelectContext.Provider>
        <ListEmptyState
          isEmpty={isEmpty}
          isLoading={isLoading}
          noItemsText={noItemsText}
        />
        <ListLoadingState
          root={domRef.current}
          isLoading={isLoading}
          onLoadMore={onLoadMore}
          loadingText={loadingText}
          observeDeps={[state.collection]}
        />
      </ul>
    </div>
  );
}
