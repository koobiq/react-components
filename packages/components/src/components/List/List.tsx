'use client';

import { forwardRef } from 'react';
import type { Ref } from 'react';

import { isNotNil, useDOMRef, mergeProps, clsx } from '@koobiq/react-core';
import {
  type ListState,
  useListBox,
  useListState,
} from '@koobiq/react-primitives';

import { Typography } from '../Typography';

import { ListOption, ListSection } from './components';
import s from './List.module.css';
import type { ListComponent, ListProps, ListRef, ListBaseProps } from './types';

export type ListInnerProps<T extends object> = {
  state: ListState<T>;
  listRef?: Ref<HTMLUListElement>;
} & Omit<ListBaseProps<T>, 'ref'>;

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
      className: clsx(s.base, className),
    },
    slotProps?.list,
    listBoxProps
  );

  return (
    <>
      {isNotNil(label) && <Typography {...titleProps}>{label}</Typography>}
      <ul {...listProps}>
        {[...state.collection].map((item) =>
          item.type === 'section' ? (
            <ListSection key={item.key} section={item} state={state} />
          ) : (
            <ListOption key={item.key} item={item} state={state} />
          )
        )}
      </ul>
    </>
  );
}

function ListRender<T extends object>(props: ListProps<T>, ref: Ref<ListRef>) {
  const state = useListState(props);

  return <ListInner listRef={ref} {...props} state={state} />;
}

export const List = forwardRef(ListRender) as ListComponent;
