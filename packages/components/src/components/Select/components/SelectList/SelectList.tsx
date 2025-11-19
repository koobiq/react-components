'use client';

import type { Ref } from 'react';

import {
  clsx,
  isNotNil,
  mergeProps,
  useDOMRef,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';
import { type MultiSelectState, useListBox } from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';
import { Divider } from '../../../Divider';
import type { ListProps } from '../../../List';
import {
  ListEmptyState,
  ListLoadMoreItem,
  ListSection,
} from '../../../List/components';
import { Typography } from '../../../Typography';
import intlMessages from '../../intl';
import type { SelectProps } from '../../types';
import { SelectOption } from '../SelectOption';

import s from './SelectList.module.css';

const { list } = utilClasses;

export type SelectListProps<T extends object> = {
  state: MultiSelectState<T>;
  listRef?: Ref<HTMLUListElement>;
} & Omit<ListProps<T>, 'ref' | 'children'> &
  Pick<SelectProps<T>, 'noItemsText' | 'isLoading' | 'onLoadMore'>;

export function SelectList<T extends object>(props: SelectListProps<T>) {
  const {
    label,
    className,
    style,
    slotProps,
    state,
    isLoading,
    onLoadMore,
    listRef,
    noItemsText: noItemsTextProp,
  } = props;

  const t = useLocalizedStringFormatter(intlMessages);

  const domRef = useDOMRef(listRef);

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
      ref: domRef,
      className: clsx(list, className),
      'data-padded': true,
    },
    slotProps?.list,
    listBoxProps
  );

  const noItemsText = noItemsTextProp ?? t.format('empty items');

  const renderItems = (treeState: typeof state) =>
    [...treeState.collection].map((item) => {
      switch (item.type) {
        case 'divider':
          return <Divider key={item.key} />;

        case 'item':
          return <SelectOption key={item.key} item={item} state={state} />;

        case 'section':
          return <ListSection key={item.key} section={item} state={state} />;

        default:
          return null;
      }
    });

  return (
    <>
      {isNotNil(label) && <Typography {...titleProps}>{label}</Typography>}
      <ul {...listProps}>
        {renderItems(state)}
        <ListEmptyState
          isEmpty={isEmpty}
          isLoading={isLoading}
          noItemsText={noItemsText}
        />
        <ListLoadMoreItem isLoading={isLoading} onLoadMore={onLoadMore} />
      </ul>
    </>
  );
}
