'use client';

import { forwardRef } from 'react';
import type { Ref } from 'react';

import { clsx, isNotNil, useDOMRef, mergeProps } from '@koobiq/react-core';
import { useListBox, useListState } from '@koobiq/react-primitives';

import { Typography } from '../Typography';

import { ListOption, ListSection } from './components';
import s from './List.module.css';
import type { ListComponent, ListProps, ListRef } from './types';

export function ListRender<T extends object>(
  props: ListProps<T>,
  ref: Ref<ListRef>
) {
  const { className, label } = props;

  const domRef = useDOMRef(ref);

  const state = useListState(props);

  const { listBoxProps, labelProps } = useListBox(props, state, domRef);

  const listProps = mergeProps(
    {
      className: clsx(s.base, className),
      ref: domRef,
    },
    listBoxProps
  );

  return (
    <>
      {isNotNil(label) && (
        <Typography
          variant="text-normal-strong"
          className={s.label}
          {...labelProps}
        >
          {label}
        </Typography>
      )}
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
