'use client';

import type { Ref } from 'react';
import { forwardRef, useCallback } from 'react';

import {
  clsx,
  mergeProps,
  useElementSize,
  useMultiRef,
} from '@koobiq/react-core';
import type { Node } from '@koobiq/react-core';
import {
  useTable,
  useTableState,
  useTableColumnResizeState,
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

function TableRender<T extends object>(
  props: TableProps<T>,
  ref?: Ref<TableRef>
) {
  const {
    divider = 'none',
    stickyHeader,
    fullWidth,
    slotProps,
    selectionMode,
    selectionBehavior,
    allowsResize,
    renderSortIcon,
    className,
    onResizeStart,
    onResize,
    onResizeEnd,
    style,
  } = props;

  const { theadRef } = useTableContainerContext();
  const { ref: domRef, width: tableWidth } = useElementSize();

  const tableRef = useMultiRef([ref, domRef]);

  const state = useTableState({
    ...props,
    showSelectionCheckboxes:
      selectionMode === 'multiple' && selectionBehavior !== 'replace',
  });

  const { collection } = state;
  const { gridProps } = useTable(props, state, domRef);

  const getDefaultMinWidth = useCallback(
    (column: Node<T>) => (column.props.isSelectionCell ? 40 : undefined),
    []
  );

  const getDefaultWidth = useCallback(
    (column: Node<T>) => (column.props.isSelectionCell ? 40 : undefined),
    []
  );

  const layoutState = allowsResize
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useTableColumnResizeState(
        {
          // Matches the width of the table itself
          tableWidth: tableWidth || 300,
          getDefaultMinWidth,
          getDefaultWidth,
        },
        state
      )
    : undefined;

  const tableProps = mergeProps(
    {
      className: clsx(
        s.base,
        fullWidth && s.fullWidth,
        allowsResize && s.allowsResize,
        textNormal,
        className
      ),
      'data-divider': divider,
      'data-allows-resize': allowsResize || undefined,
      'data-sticky-header': stickyHeader || undefined,
      'data-fullwidth': fullWidth || undefined,
      ref: tableRef,
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
