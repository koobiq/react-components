'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useRef } from 'react';

import {
  clsx,
  useFilter,
  mergeProps,
  useMultiRef,
  useControlledState,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';
import {
  useListBox,
  useAutocomplete,
  useAutocompleteState,
  // eslint-disable-next-line camelcase
  UNSTABLE_useFilteredListState,
} from '@koobiq/react-primitives';
import type {
  SelectState,
  AutocompleteAria,
  AriaListBoxProps,
} from '@koobiq/react-primitives';
import type { SelectionMode } from '@react-types/select';

import { utilClasses } from '../../../../styles/utility';
import { Divider } from '../../../Divider';
import { ListEmptyState, ListLoadingState } from '../../../List/components';
import { SearchInput, type SearchInputProps } from '../../../SearchInput';
import intlMessages from '../../intl';
import { SelectContext } from '../../SelectContext';
import { CollectionRoot } from '../../utils';

import s from './SelectList.module.css';

const { list } = utilClasses;

export type SelectListProps<
  T extends object,
  M extends SelectionMode = 'single',
> = {
  state: SelectState<T, M>;
  /** The filter function used to determine if a option should be included in the Select list. */
  defaultFilter?: (textValue: string, inputValue: string) => boolean;
  /** The value of the Select search input (controlled). */
  inputValue?: string;
  /** The default value of the Select search input (uncontrolled). */
  defaultInputValue?: string;
  /** Handler that is called when the Select search input value changes. */
  onInputChange?: (value: string) => void;
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** The load more spinner to render when loading additional items. */
  isLoading?: boolean;
  /** Handler that is called when more items should be loaded, e.g. while scrolling near the bottom. */
  onLoadMore?: () => void;
  /** Content to display when no items are available. */
  noItemsText?: ReactNode;
  /** Content to display when items are loading. */
  loadingText?: ReactNode;
  /** Enables search input for filtering items in the list. */
  isSearchable?: boolean;
} & Omit<AriaListBoxProps<T>, 'children'>;

export function SelectList<
  T extends object,
  M extends SelectionMode = 'single',
>(props: SelectListProps<T, M>) {
  const {
    style,
    isLoading,
    className,
    onLoadMore,
    inputValue,
    isSearchable,
    onInputChange,
    state: inState,
    defaultInputValue,
    defaultFilter,
    noItemsText: noItemsTextProp,
    loadingText: loadingTextProp,
  } = props;

  const t = useLocalizedStringFormatter(intlMessages);

  const noItemsText =
    noItemsTextProp === undefined ? t.format('empty items') : noItemsTextProp;

  const domRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const collectionRef = useRef<HTMLElement>(null);

  // search
  const { contains } = useFilter({ sensitivity: 'base' });

  const [filterText, setFilterText] = useControlledState(
    inputValue,
    defaultInputValue ?? '',
    onInputChange
  );

  const autocompleteState = useAutocompleteState({
    inputValue: isSearchable ? filterText : '',
    onInputChange: isSearchable ? setFilterText : () => {},
  });

  const {
    inputProps,
    collectionProps,
    filter: filterFn,
    collectionRef: mergedCollectionRef,
  } = useAutocomplete(
    {
      inputRef,
      collectionRef,
      filter: defaultFilter || contains,
    },
    autocompleteState
  );

  const listRef = useMultiRef([mergedCollectionRef, domRef]);

  const state = UNSTABLE_useFilteredListState(
    inState,
    isSearchable ? filterFn : null
  );

  const isEmpty = state.collection.size === 0;

  const { listBoxProps } = useListBox(
    mergeProps(props, isSearchable ? collectionProps : null),
    state,
    domRef
  );

  const listProps = mergeProps(
    {
      style,
      ref: listRef,
      'data-padded': true,
      className: clsx(list, className),
    },
    listBoxProps
  );

  const searchInputProps = mergeProps<
    [SearchInputProps, AutocompleteAria<T>['inputProps']]
  >(
    {
      autoFocus: true,
      fullWidth: true,
      isLabelHidden: true,
      'aria-label': 'search',
      variant: 'transparent',
    },
    inputProps
  );

  const loadingText = loadingTextProp ?? t.format('loading');

  const { collection } = state;

  return (
    <div className={s.base}>
      {isSearchable && (
        <>
          <SearchInput ref={inputRef} {...searchInputProps} />
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
