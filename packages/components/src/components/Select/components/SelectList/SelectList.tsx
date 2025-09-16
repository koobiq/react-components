import type { Ref } from 'react';

import { clsx, isNotNil, mergeProps, useDOMRef } from '@koobiq/react-core';
import { type MultiSelectState, useListBox } from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';
import { Divider as SelectDivider } from '../../../Divider';
import type { ListProps } from '../../../List';
import { ListSection } from '../../../List/components';
import { Typography } from '../../../Typography';
import { SelectOption } from '../SelectOption';

import s from './SelectList.module.css';

const { list } = utilClasses;

export type SelectListProps<T extends object> = {
  state: MultiSelectState<T>;
  listRef?: Ref<HTMLUListElement>;
} & Omit<ListProps<T>, 'ref'>;

export function SelectList<T extends object>(props: SelectListProps<T>) {
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
      'data-padded': true,
    },
    slotProps?.list,
    listBoxProps
  );

  const renderItems = (treeState: typeof state) =>
    [...treeState.collection].map((item) => {
      switch (item.type) {
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
      <ul {...listProps}>{renderItems(state)}</ul>
    </>
  );
}
