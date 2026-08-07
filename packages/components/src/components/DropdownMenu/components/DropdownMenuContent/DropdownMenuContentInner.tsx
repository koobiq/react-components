'use client';

import {
  clsx,
  useFilter,
  mergeProps,
  useControlledState,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';
import type { MenuProps as AriaMenuProps } from '@koobiq/react-primitives';
import {
  Menu as AriaMenu,
  Autocomplete as AriaAutocomplete,
  composeRenderProps,
} from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';
import { Divider } from '../../../Divider';
import { DropdownFooter } from '../../../DropdownFooter';
import intlMessages from '../../intl';
import { DropdownMenuSearch } from '../DropdownMenuSearch';

import s from './DropdownMenuContent.module.css';
import type { DropdownMenuContentProps } from './types';

const textVariant = utilClasses.typography;
const { list } = utilClasses;

type DropdownMenuContentInnerProps<T extends object> = Omit<
  DropdownMenuContentProps<T>,
  | 'ref'
  | 'style'
  | 'offset'
  | 'anchorRef'
  | 'placement'
  | 'className'
  | 'shouldFlip'
  | 'isNonModal'
  | 'crossOffset'
  | 'data-testid'
  | 'maxBlockSize'
  | 'containerPadding'
>;

/**
 * The inside of the menu popover. Mounted and unmounted with the popover, so
 * the search query resets on close on its own.
 */
export function DropdownMenuContentInner<T extends object = object>(
  props: DropdownMenuContentInnerProps<T>
) {
  const {
    children,
    slotProps,
    noItemsText,
    inputValue,
    isSearchable,
    defaultFilter,
    onInputChange,
    dropdownFooter,
    defaultInputValue,
    ...other
  } = props;

  const t = useLocalizedStringFormatter(intlMessages);

  const { contains } = useFilter({ sensitivity: 'base' });

  const [query, setQuery] = useControlledState(
    inputValue,
    defaultInputValue ?? '',
    onInputChange
  );

  const { className: menuClassName, ...menuSlotProps } = slotProps?.menu ?? {};

  const menuProps = mergeProps<
    [AriaMenuProps<T>, Omit<AriaMenuProps<T>, 'className' | 'children'>]
  >(
    {
      children,
      renderEmptyState: () => (
        <div className={clsx(s.empty, textVariant['text-normal'])}>
          {noItemsText ??
            t.format(query.trim() ? 'nothing found' : 'empty items')}
        </div>
      ),
      className: composeRenderProps(menuClassName, (menuClassName) =>
        clsx(s.menu, list, menuClassName)
      ),
      ...other,
    },
    menuSlotProps
  );

  const menu = <AriaMenu<T> data-padded {...menuProps} />;

  const footer = (
    <DropdownFooter {...slotProps?.dropdownFooter}>
      {dropdownFooter}
    </DropdownFooter>
  );

  if (!isSearchable)
    return (
      <>
        {menu}
        {footer}
      </>
    );

  return (
    <AriaAutocomplete
      inputValue={query}
      onInputChange={setQuery}
      filter={defaultFilter ?? contains}
    >
      {/* Must be a sibling of the menu: the menu clears the field context. */}
      <DropdownMenuSearch {...slotProps?.['search-input']} />
      <Divider disablePaddings {...slotProps?.divider} />
      {menu}
      {footer}
    </AriaAutocomplete>
  );
}
