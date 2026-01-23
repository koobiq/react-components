'use client';

import { useRef } from 'react';

import { useFocusRing, mergeProps, clsx } from '@koobiq/react-core';
import { IconChevronUpS16, IconChevronDownS16 } from '@koobiq/react-icons';
import type {
  TableState,
  AriaTableColumnHeaderProps,
  TableColumnResizeState,
  AriaTableColumnResizeProps,
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
} & Pick<
  AriaTableColumnResizeProps<T>,
  'onResizeStart' | 'onResize' | 'onResizeEnd'
>;

const textNormal = utilClasses.typography['text-normal'];

export function TableColumnHeader<T>({
  column,
  state,
  renderSortIcon,
  layoutState,
  onResizeStart,
  onResize,
  onResizeEnd,
}: TableColumnHeaderProps<T>) {
  const ref = useRef<HTMLTableCellElement | null>(null);

  const { columnHeaderProps } = useTableColumnHeader(
    { node: column },
    state,
    ref
  );

  const {
    align = 'start',
    valign = 'middle',
    style: styleProp,
    className,
    allowsSorting,
    allowsResizing,
  }: ColumnProps<T> = column.props;

  const { isFocusVisible, focusProps } = useFocusRing();

  const isActive = state.sortDescriptor?.column === column.key;

  const direction = isActive ? state.sortDescriptor?.direction : undefined;

  const defaultIcon =
    direction === 'ascending' ? <IconChevronUpS16 /> : <IconChevronDownS16 />;

  const iconToRender = renderSortIcon?.({ direction, isActive }) ?? defaultIcon;

  const columnSortIcon = allowsSorting && (
    <span aria-hidden="true" className={clsx(s.sortIcon, isActive && s.active)}>
      {iconToRender}
    </span>
  );

  const isResizable = !!(allowsResizing && layoutState);

  return (
    <th
      className={clsx(
        s.base,
        textNormal,
        align && s[align],
        valign && s[valign],
        allowsSorting && s.sortable,
        isFocusVisible && s.focusVisible,
        className
      )}
      data-align={align || undefined}
      data-valign={valign || undefined}
      data-allows-sorting={allowsSorting || undefined}
      data-allows-resizing={isResizable || undefined}
      {...mergeProps(columnHeaderProps, focusProps)}
      style={{
        ...styleProp,
        inlineSize: layoutState?.getColumnWidth(column.key),
      }}
      ref={ref}
    >
      {isResizable ? (
        <>
          <div className={s.container}>
            <button className={s.content}>{column.rendered}</button>
            {columnSortIcon}
          </div>
          <Resizer
            column={column}
            onResize={onResize}
            layoutState={layoutState}
            onResizeEnd={onResizeEnd}
            onResizeStart={onResizeStart}
          />
        </>
      ) : (
        <span className={s.container}>
          {column.rendered}
          {columnSortIcon}
        </span>
      )}
    </th>
  );
}
