'use client';

import { useRef } from 'react';

import { useFocusRing, mergeProps, clsx } from '@koobiq/react-core';
import { useTableColumnHeader } from '@koobiq/react-primitives';
import type {
  TableState,
  AriaTableColumnHeaderProps,
} from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';
import type { ColumnProps } from '../../../Collections';
import s from '../../Table.module.css';

type TableColumnHeaderProps<T> = {
  column: AriaTableColumnHeaderProps<T>['node'];
  state: TableState<T>;
};

const textNormal = utilClasses.typography['text-normal'];

export function TableColumnHeader<T>({
  column,
  state,
}: TableColumnHeaderProps<T>) {
  const ref = useRef<HTMLTableCellElement | null>(null);

  const { columnHeaderProps } = useTableColumnHeader(
    { node: column },
    state,
    ref
  );

  const {
    style,
    className,
    align = 'left',
    valign = 'middle',
  }: ColumnProps<T> = column.props;

  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <th
      align={align}
      className={clsx(
        s['header-cell'],
        isFocusVisible && s.focusVisible,
        valign && s[valign],
        textNormal,
        className
      )}
      style={style}
      {...mergeProps(columnHeaderProps, focusProps)}
      ref={ref}
    >
      {column.rendered}
    </th>
  );
}
