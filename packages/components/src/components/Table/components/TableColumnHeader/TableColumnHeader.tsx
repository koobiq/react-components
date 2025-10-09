'use client';

import { useRef } from 'react';

import { useFocusRing, mergeProps, clsx } from '@koobiq/react-core';
import { IconChevronUpS16, IconChevronDownS16 } from '@koobiq/react-icons';
import { useTableColumnHeader } from '@koobiq/react-primitives';
import type {
  TableState,
  AriaTableColumnHeaderProps,
} from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';
import type { ColumnProps } from '../../../Collections';
import type { TableProps } from '../../types';

import s from './TableColumnHeader.module.css';

type TableColumnHeaderProps<T> = {
  column: AriaTableColumnHeaderProps<T>['node'];
  state: TableState<T>;
  renderSortIcon?: TableProps<T>['renderSortIcon'];
};

const textNormal = utilClasses.typography['text-normal'];

export function TableColumnHeader<T>({
  column,
  state,
  renderSortIcon,
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
    align = 'start',
    valign = 'middle',
  }: ColumnProps<T> = column.props;

  const { isFocusVisible, focusProps } = useFocusRing();

  const isActive = state.sortDescriptor?.column === column.key;
  const { allowsSorting } = column.props;

  const direction = isActive ? state.sortDescriptor?.direction : undefined;

  const defaultIcon =
    direction === 'ascending' ? <IconChevronUpS16 /> : <IconChevronDownS16 />;

  const iconToRender = renderSortIcon?.({ direction, isActive }) ?? defaultIcon;

  return (
    <th
      className={clsx(
        s.base,
        align && s[align],
        valign && s[valign],
        isFocusVisible && s.focusVisible,
        allowsSorting && s.sortable,
        textNormal,
        className
      )}
      data-align={align || undefined}
      data-valign={valign || undefined}
      data-allows-sorting={allowsSorting || undefined}
      style={style}
      {...mergeProps(columnHeaderProps, focusProps)}
      ref={ref}
    >
      <span className={s.content}>
        {column.rendered}
        {allowsSorting && (
          <span
            aria-hidden="true"
            className={clsx(s.sortIcon, isActive && s.active)}
          >
            {iconToRender}
          </span>
        )}
      </span>
    </th>
  );
}
