'use client';

import { useRef } from 'react';

import {
  mergeProps,
  useMultiRef,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';
import { FieldInputContext, useSlottedContext } from '@koobiq/react-primitives';

import { SearchInput, type SearchInputProps } from '../../../SearchInput';
import intlMessages from '../../intl';

import s from './DropdownMenuSearch.module.css';
import type { DropdownMenuSearchProps } from './types';

/**
 * The search field of a dropdown menu. React Aria passes the input props
 * through a context, so this bridges them onto the Koobiq `SearchInput`.
 */
export function DropdownMenuSearch(props: DropdownMenuSearchProps) {
  const t = useLocalizedStringFormatter(intlMessages);

  const domRef = useRef<HTMLInputElement>(null);

  const { ref: contextRef, ...autocompleteInputProps } =
    useSlottedContext(FieldInputContext) ?? {};

  const inputRef = useMultiRef([contextRef, domRef]);

  // Autocomplete props go last so its value, handlers and
  // `aria-activedescendant` win over anything passed in.
  const searchInputProps = mergeProps<
    [SearchInputProps, SearchInputProps, SearchInputProps]
  >(
    {
      autoFocus: true,
      fullWidth: true,
      isLabelHidden: true,
      className: s.search,
      variant: 'transparent',
      placeholder: t.format('search'),
      'aria-label': t.format('search'),
    },
    props,
    autocompleteInputProps as SearchInputProps
  );

  return <SearchInput ref={inputRef} {...searchInputProps} />;
}

DropdownMenuSearch.displayName = 'DropdownMenuSearch';
