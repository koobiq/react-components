'use client';

import type { Ref } from 'react';
import { forwardRef } from 'react';

import { clsx, useDOMRef, mergeProps } from '@koobiq/react-core';
import { useTable, useTableState } from '@koobiq/react-primitives';

import { utilClasses } from '../../styles/utility';
import { Cell, Row, Column, TableBody, TableHeader } from '../Collections';

import {
  TableRow,
  TableCell,
  TableRowGroup,
  TableHeaderRow,
  TableColumnHeader,
  TableSelectAllCell,
  TableCheckboxCell,
  TableContainer,
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
    renderSortIcon,
    className,
    style,
  } = props;

  const { theadRef } = useTableContainerContext();

  const state = useTableState({
    ...props,
    showSelectionCheckboxes:
      selectionMode === 'multiple' && selectionBehavior !== 'replace',
  });

  const domRef = useDOMRef<HTMLTableElement>(ref);

  const { collection } = state;
  const { gridProps } = useTable(props, state, domRef);

  const tableProps = mergeProps(
    {
      className: clsx(s.base, fullWidth && s.fullWidth, textNormal, className),
      'data-sticky-header': stickyHeader || undefined,
      'data-divider': divider,
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
                  key={column.key}
                  column={column}
                  state={state}
                />
              ) : (
                <TableColumnHeader
                  key={column.key}
                  column={column}
                  state={state}
                  renderSortIcon={renderSortIcon}
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
