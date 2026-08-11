'use client';

import { useFilter, useLocalizedStringFormatter } from '@koobiq/react-core';
import {
  Autocomplete as AriaAutocomplete,
  Provider,
} from '@koobiq/react-primitives';

import type { SearchInputProps } from '../../../SearchInput';
import { SearchInputContext } from '../../../SearchInput/SearchInputContext';
import intlMessages from '../../intl';

import s from './DropdownMenuAutocomplete.module.css';
import type { DropdownMenuAutocompleteProps } from './types';

/**
 * Filters the items of a dropdown menu with a field. The field has to be a
 * sibling of the menu, not a child of it: the menu clears the field context for
 * its own subtree. The field may also live outside the popover, next to the
 * whole `DropdownMenu`.
 */
export function DropdownMenuAutocomplete(props: DropdownMenuAutocompleteProps) {
  const { contains } = useFilter({ sensitivity: 'base' });
  const t = useLocalizedStringFormatter(intlMessages);

  const searchInputProps: SearchInputProps = {
    autoFocus: true,
    fullWidth: true,
    isLabelHidden: true,
    className: s.search,
    variant: 'transparent',
    placeholder: t.format('search'),
    'aria-label': t.format('search'),
  };

  return (
    <Provider values={[[SearchInputContext, searchInputProps]]}>
      <AriaAutocomplete filter={contains} {...props} />
    </Provider>
  );
}

DropdownMenuAutocomplete.displayName = 'DropdownMenu.Autocomplete';
