'use client';

import { forwardRef } from 'react';
import type { Ref } from 'react';

import { isNotNil, useDOMRef, mergeProps, clsx } from '@koobiq/react-core';
import { useListBox, useListState } from '@koobiq/react-primitives';

import { Typography } from '../Typography';

import { ListOption, ListSection } from './components';
import s from './List.module.css';
import type { ListComponent, ListProps, ListRef } from './types';

export function ListRender<T extends object>(
  props: ListProps<T>,
  ref: Ref<ListRef>
) {
  const { label, className, style, slotProps } = props;

  const domRef = useDOMRef(ref);

  const state = useListState(props);

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

export const List = forwardRef(ListRender) as ListComponent;
