'use client';

import type { RefObject } from 'react';

import type { Node } from '@koobiq/react-core';
import {
  clsx,
  mergeProps,
  useObjectRef,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';
import {
  useListBox,
  // eslint-disable-next-line camelcase
  UNSTABLE_useFilteredListState,
} from '@koobiq/react-primitives';
import type { SelectState, AutocompleteAria } from '@koobiq/react-primitives';
import type { SelectionMode } from '@react-types/select';

import { utilClasses } from '../../../../styles/utility';
import { Divider } from '../../../Divider';
import type { ListProps } from '../../../List';
import { ListEmptyState, ListLoadingState } from '../../../List/components';
import { SearchInput } from '../../../SearchInput';
import intlMessages from '../../intl';
import { SelectContext } from '../../SelectContext';
import type { SelectProps } from '../../types';
import { CollectionRoot } from '../../utils';

import s from './SelectList.module.css';

const { list } = utilClasses;

export type SelectListProps<
  T extends object,
  M extends SelectionMode = 'single',
> = {
  state: SelectState<T, M>;
  listRef?: RefObject<HTMLElement | null>;
  inputRef?: RefObject<HTMLInputElement | null>;
  filterFn?: (nodeValue: string, node: Node<T>) => boolean;
  inputProps?: AutocompleteAria<T>['inputProps'];
} & Omit<ListProps<T>, 'ref' | 'children'> &
  Pick<
    SelectProps<T>,
    'noItemsText' | 'isLoading' | 'onLoadMore' | 'isSearchable'
  >;

export function SelectList<
  T extends object,
  M extends SelectionMode = 'single',
>(props: SelectListProps<T, M>) {
  const {
    style,
    listRef,
    inputRef,
    filterFn,
    slotProps,
    isLoading,
    className,
    onLoadMore,
    inputProps,
    isSearchable,
    state: inState,
    noItemsText: noItemsTextProp,
    loadingText: loadingTextProp,
  } = props;

  const t = useLocalizedStringFormatter(intlMessages);

  const domRef = useObjectRef(listRef);

  const state = UNSTABLE_useFilteredListState(
    inState,
    isSearchable ? filterFn : null
  );

  const isEmpty = state.collection.size === 0;

  const { listBoxProps } = useListBox(props, state, domRef);

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
    <div className={s.base}>
      {isSearchable && (
        <>
          <SearchInput
            ref={inputRef}
            aria-label="search"
            variant="transparent"
            isLabelHidden
            autoFocus
            fullWidth
            {...inputProps}
          />
          <Divider disablePaddings />
        </>
      )}

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
