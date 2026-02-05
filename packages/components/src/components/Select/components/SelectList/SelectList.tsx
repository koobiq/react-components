'use client';

import type { Ref } from 'react';

import {
  clsx,
  isNotNil,
  mergeProps,
  useDOMRef,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';
import {
  type MultiSelectState,
  useListBox,
  UNSTABLE_useFilteredListState,
} from '@koobiq/react-primitives';
import type { Node } from '@react-types/shared';

import { utilClasses } from '../../../../styles/utility';
import type { ListProps } from '../../../List';
import { ListEmptyState, ListLoadingState } from '../../../List/components';
import { Typography } from '../../../Typography';
import intlMessages from '../../intl';
import { SelectContext } from '../../SelectContext';
import type { SelectProps } from '../../types';
import { CollectionRoot } from '../../utils';

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
    state: inputState,
    isLoading,
    onLoadMore,
    listRef,
    noItemsText: noItemsTextProp,
    loadingText: loadingTextProp,
  } = props;

  const state = UNSTABLE_useFilteredListState?.(
    inputState,
    (nodeValue: string, node: Node<T>) => {
      console.log(nodeValue, node);

      return nodeValue === 'IDS/IPS Alert' || nodeValue === 'Identity Theft';
    }
  );

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

  const noItemsText =
    noItemsTextProp === undefined ? t.format('empty items') : noItemsTextProp;

  const loadingText = loadingTextProp ?? t.format('loading');

  // const renderItems = (treeState: typeof state) =>
  //   [...treeState.collection].map((item) => {
  //     switch (item.type) {
  //       case 'divider':
  //         return <Divider key={item.key} />;
  //
  //       case 'item':
  //         return <SelectOption key={item.key} item={item} state={state} />;
  //
  //       case 'section':
  //         return <ListSection key={item.key} section={item} state={state} />;
  //
  //       default:
  //         return null;
  //     }
  //   });

  const { collection } = state;

  return (
    <>
      {isNotNil(label) && <Typography {...titleProps}>{label}</Typography>}
      <ul {...listProps}>
        <SelectContext.Provider value={state}>
          <CollectionRoot collection={collection} scrollRef={listRef} />
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
    </>
  );
}
