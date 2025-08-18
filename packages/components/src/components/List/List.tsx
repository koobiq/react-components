'use client';

import { forwardRef } from 'react';
import type { Ref } from 'react';

import { isNotNil, useDOMRef, mergeProps, clsx } from '@koobiq/react-core';
import {
  type ListState,
  useListBox,
  useListState,
} from '@koobiq/react-primitives';

import { utilClasses } from '../../styles/utility';
import { Item, Section, Divider } from '../Collections';
import { Divider as ListDivider } from '../Divider';
import { Typography } from '../Typography';

import { ListItemText, ListOption, ListSection } from './components';
import s from './List.module.css';
import type { ListComponent, ListProps, ListRef } from './types';

const { list } = utilClasses;

export type ListInnerProps<T extends object> = {
  state: ListState<T>;
  listRef?: Ref<HTMLUListElement>;
} & Omit<ListProps<T>, 'ref'>;

export function ListInner<T extends object>(props: ListInnerProps<T>) {
  const { label, className, style, slotProps, state, listRef } = props;

  const domRef = useDOMRef(listRef);

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
    },
    slotProps?.list,
    listBoxProps
  );

  const renderItems = (listState: typeof state) =>
    [...listState.collection].map((item) => {
      switch (item.type) {
        case 'divider':
          return <ListDivider key={item.key} className={s.divider} />;

        case 'item':
          return <ListOption key={item.key} item={item} state={state} />;

        case 'section':
          return <ListSection key={item.key} section={item} state={state} />;

        default:
          return null;
      }
    });

  return (
    <>
      {isNotNil(label) && <Typography {...titleProps}>{label}</Typography>}
      <ul {...listProps}>{renderItems(state)}</ul>
    </>
  );
}

function ListRender<T extends object>(props: ListProps<T>, ref: Ref<ListRef>) {
  const state = useListState(props);

  return <ListInner listRef={ref} {...props} state={state} />;
}

const ListComponent = forwardRef(ListRender) as ListComponent;

type CompoundedComponent = typeof ListComponent & {
  Item: typeof Item;
  Section: typeof Section;
  Divider: typeof Divider;
  ItemText: typeof ListItemText;
};

export const List = ListComponent as CompoundedComponent;

List.Item = Item;
List.Section = Section;
List.Divider = Divider;
List.ItemText = ListItemText;
