'use client';

import type { ReactNode, Ref } from 'react';

import {
  clsx,
  isNotNil,
  mergeProps,
  useDOMRef,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';
import { type MultiSelectState, useListBox } from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';
import { isPrimitiveNode } from '../../../../utils';
import { Divider as SelectDivider } from '../../../Divider';
import type { ListProps } from '../../../List';
import { ListSection } from '../../../List/components';
import { Typography } from '../../../Typography';
import intlMessages from '../../intl';
import { SelectLoadMoreItem } from '../SelectLoadMoreItem';
import { SelectOption } from '../SelectOption';

import s from './SelectList.module.css';

const { list, typography } = utilClasses;

export type SelectListProps<T extends object> = {
  state: MultiSelectState<T>;
  listRef?: Ref<HTMLUListElement>;
  /** Content to display when no items are available. */
  noItemsText?: ReactNode;
} & Omit<ListProps<T>, 'ref' | 'children'>;

export function SelectList<T extends object>(props: SelectListProps<T>) {
  const {
    label,
    className,
    style,
    slotProps,
    state,
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

  const emptyState = isEmpty ? (
    <div
      // eslint-disable-next-line
      role="option"
      className={clsx(s.empty, typography['text-normal'])}
      {...(!isPrimitiveNode(noItemsText) && {
        style: { display: 'contents' },
      })}
    >
      {noItemsText}
    </div>
  ) : null;

  const renderItems = (treeState: typeof state) =>
    [...treeState.collection].map((item) => {
      switch (item.type) {
        case 'loadMoreItem':
          return <SelectLoadMoreItem key={item.key} item={item} />;

        case 'divider':
          return <SelectDivider key={item.key} />;

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
        {emptyState}
      </ul>
    </>
  );
}
