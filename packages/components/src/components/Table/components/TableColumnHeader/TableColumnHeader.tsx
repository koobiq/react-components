'use client';

import { useRef } from 'react';

import { useFocusRing, mergeProps, clsx } from '@koobiq/react-core';
import { IconChevronUpS16, IconChevronDownS16 } from '@koobiq/react-icons';
import type {
  TableState,
  AriaTableColumnHeaderProps,
  TableColumnResizeState,
} from '@koobiq/react-primitives';
import { useTableColumnHeader } from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';
import type { ColumnProps } from '../../../Collections';
import type { TableProps } from '../../types';
import { Resizer } from '../Resizer';

import s from './TableColumnHeader.module.css';

type TableColumnHeaderProps<T> = {
  column: AriaTableColumnHeaderProps<T>['node'];
  state: TableState<T>;
  renderSortIcon?: TableProps<T>['renderSortIcon'];
  layoutState?: TableColumnResizeState<T>;
};

const textNormal = utilClasses.typography['text-normal'];

export function TableColumnHeader<T>({
  column,
  state,
  renderSortIcon,
  layoutState,
}: TableColumnHeaderProps<T>) {
  const ref = useRef<HTMLTableCellElement | null>(null);

  const { columnHeaderProps } = useTableColumnHeader(
    { node: column },
    state,
    ref
  );

  const {
    style: styleProp,
    className,
    align = 'start',
    valign = 'middle',
  }: ColumnProps<T> = column.props;

  const { isFocusVisible, focusProps } = useFocusRing();

  const isActive = state.sortDescriptor?.column === column.key;
  const { allowsSorting, allowsResizing } = column.props;

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
      {...mergeProps(columnHeaderProps, focusProps)}
      style={{
        ...styleProp,
        width: layoutState?.getColumnWidth(column.key),
      }}
      ref={ref}
    >
      <span className={s.container}>
        <span className={s.content}>{column.rendered}</span>
        {allowsSorting && (
          <span
            aria-hidden="true"
            className={clsx(s.sortIcon, isActive && s.active)}
          >
            {iconToRender}
          </span>
        )}
      </span>
      {allowsResizing && layoutState && (
        <Resizer column={column} layoutState={layoutState} />
      )}
    </th>
  );
}
