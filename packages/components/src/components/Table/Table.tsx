'use client';

import type { ComponentRef, Ref } from 'react';
import { forwardRef, useCallback } from 'react';

import { once } from '@koobiq/logger';
import { clsx, useDOMRef, mergeProps } from '@koobiq/react-core';
import type { Node } from '@koobiq/react-core';
import {
  useTable,
  useTableState,
  useTableColumnResizeState,
} from '@koobiq/react-primitives';
import type {
  TableState,
  TableColumnResizeState,
} from '@koobiq/react-primitives';

import { utilClasses } from '../../styles/utility';
import { Cell, Row, Column, TableBody, TableHeader } from '../Collections';

import {
  TableRow,
  TableCell,
  TableRowGroup,
  TableContainer,
  TableHeaderRow,
  TableColumnHeader,
  TableSelectAllCell,
  TableCheckboxCell,
  useTableContainerContext,
} from './components';
import s from './Table.module.css';
import type { TableComponent, TableProps, TableRef } from './types';

const textNormal = utilClasses.typography['text-normal'];

type TableBaseProps<T> = TableProps<T> & {
  state: TableState<T>;
  tableRef?: Ref<HTMLTableElement>;
  layoutState?: TableColumnResizeState<T>;
};
type ResizableTableProps<T> = TableProps<T> & {
  state: TableState<T>;
  tableRef?: Ref<HTMLTableElement>;
};

function TableBase<T extends object>(props: TableBaseProps<T>) {
  const {
    divider = 'none',
    stickyHeader,
    fullWidth,
    slotProps,
    isResizable,
    renderSortIcon,
    className,
    tableRef,
    state,
    onResizeStart,
    onResize,
    onResizeEnd,
    layoutState,
    style,
  } = props;

  const { theadRef } = useTableContainerContext();

  const domRef = useDOMRef<ComponentRef<'table'>>(tableRef);

  const { collection } = state;
  const { gridProps } = useTable(props, state, domRef);

  const tableProps = mergeProps(
    {
      className: clsx(
        s.base,
        fullWidth && s.fullWidth,
        isResizable && s.resizable,
        textNormal,
        className
      ),
      'data-divider': divider,
      'data-resizable': isResizable || undefined,
      'data-sticky-header': stickyHeader || undefined,
      'data-fullwidth': fullWidth || undefined,
      ref: domRef,
      style,
    },
    gridProps,
    slotProps?.root
  );

  return (
    <table {...tableProps}>
      <TableRowGroup type="thead" ref={theadRef} theadProps={slotProps?.header}>
        {collection.headerRows.map((headerRow) => (
          <TableHeaderRow key={headerRow.key} item={headerRow} state={state}>
            {[...headerRow.childNodes].map((column) =>
              column.props.isSelectionCell ? (
                <TableSelectAllCell
                  state={state}
                  column={column}
                  key={column.key}
                  layoutState={layoutState}
                />
              ) : (
                <TableColumnHeader
                  state={state}
                  column={column}
                  key={column.key}
                  layoutState={layoutState}
                  renderSortIcon={renderSortIcon}
                  onResize={onResize}
                  onResizeEnd={onResizeEnd}
                  onResizeStart={onResizeStart}
                />
              )
            )}
          </TableHeaderRow>
        ))}
      </TableRowGroup>
      <TableRowGroup type="tbody" tbodyProps={slotProps?.body}>
        {[...collection.body.childNodes].map((row) => (
          <TableRow key={row.key} item={row} state={state}>
            {[...row.childNodes].map((cell) =>
              cell.props.isSelectionCell ? (
                <TableCheckboxCell key={cell.key} cell={cell} state={state} />
              ) : (
                <TableCell key={cell.key} cell={cell} state={state} />
              )
            )}
          </TableRow>
        ))}
      </TableRowGroup>
    </table>
  );
}

function ResizableTable<T extends object>(props: ResizableTableProps<T>) {
  const { state, tableRef } = props;

  const { tableContainerWidth } = useTableContainerContext();

  if (
    process.env.NODE_ENV !== 'production' &&
    tableContainerWidth === undefined
  ) {
    once.warn(
      'Table: if the "Table" supports column resizing, then it should also be wrapped in the "TableContainer" that defines the overall table width.'
    );
  }

  const getDefaultMinWidth = useCallback(
    (column: Node<T>) => (column.props.isSelectionCell ? 40 : undefined),
    []
  );

  const getDefaultWidth = useCallback(
    (column: Node<T>) => (column.props.isSelectionCell ? 40 : undefined),
    []
  );

  const layoutState = useTableColumnResizeState(
    {
      // Matches the width of the table itself
      tableWidth: tableContainerWidth ?? 300,
      getDefaultMinWidth,
      getDefaultWidth,
    },
    state
  );

  return <TableBase {...props} tableRef={tableRef} layoutState={layoutState} />;
}

function TableRender<T extends object>(
  props: TableProps<T>,
  ref?: Ref<TableRef>
) {
  const { selectionMode, selectionBehavior, isResizable } = props;

  const state = useTableState({
    ...props,
    showSelectionCheckboxes:
      selectionMode === 'multiple' && selectionBehavior !== 'replace',
  });

  return isResizable ? (
    <ResizableTable {...props} state={state} tableRef={ref} />
  ) : (
    <TableBase {...props} state={state} tableRef={ref} />
  );
}

const TableComponent = forwardRef(TableRender) as TableComponent;

type CompoundedComponent = typeof TableComponent & {
  Header: typeof TableHeader;
  Body: typeof TableBody;
  Column: typeof Column;
  Row: typeof Row;
  Cell: typeof Cell;
};

export const Table = TableComponent as CompoundedComponent;

export { TableContainer };

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Column = Column;
Table.Row = Row;
Table.Cell = Cell;
