'use client';

import { useContext } from 'react';

import { clsx, useLocalizedStringFormatter } from '@koobiq/react-core';
import {
  Menu as AriaMenu,
  composeRenderProps,
  AutocompleteStateContext,
} from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';
import intlMessages from '../../intl';

import s from './DropdownMenuContent.module.css';
import type { DropdownMenuContentProps } from './types';

const textVariant = utilClasses.typography;
const { list } = utilClasses;

/** The list of items of a dropdown menu. */
export function DropdownMenuContent<T extends object = object>({
  className,
  renderEmptyState,
  ...props
}: DropdownMenuContentProps<T>) {
  const t = useLocalizedStringFormatter(intlMessages);

  // Set once the menu is wrapped in a `DropdownMenu.Autocomplete`.
  const autocomplete = useContext(AutocompleteStateContext);

  const query = autocomplete?.inputValue.trim();

  return (
    <AriaMenu<T>
      data-padded
      renderEmptyState={
        renderEmptyState ??
        (() => (
          <div className={clsx(s.empty, textVariant['text-normal'])}>
            {t.format(query ? 'nothing found' : 'empty items')}
          </div>
        ))
      }
      className={composeRenderProps(className, (className) =>
        clsx(s.base, list, className)
      )}
      {...props}
    />
  );
}

DropdownMenuContent.displayName = 'DropdownMenu.Content';
