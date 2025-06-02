import { forwardRef, useRef } from 'react';

import { clsx } from '@koobiq/react-core';
import {
  Row,
  Cell,
  Column,
  useTable,
  TableBody,
  TableHeader,
  useTableState,
} from '@koobiq/react-primitives';

import { utilClasses } from '../../styles/utility';

import {
  TableRow,
  TableCell,
  TableRowGroup,
  TableHeaderRow,
  TableColumnHeader,
} from './components';
import type { TableComponentProp, TableProps } from './types';

const textNormal = utilClasses.typography['text-normal'];

function TableRender<T extends object>(props: TableProps<T>) {
  const { selectionMode, selectionBehavior } = props;

  const state = useTableState({
    ...props,
    showSelectionCheckboxes:
      selectionMode === 'multiple' && selectionBehavior !== 'replace',
  });

  const ref = useRef<HTMLTableElement | null>(null);
  const { collection } = state;
  const { gridProps } = useTable({}, state, ref);

  return (
    <table
      {...gridProps}
      ref={ref}
      style={{ borderCollapse: 'collapse' }}
      className={clsx(textNormal)}
    >
      <TableRowGroup type="thead">
        {collection.headerRows.map((headerRow) => (
          <TableHeaderRow key={headerRow.key} item={headerRow} state={state}>
            {[...headerRow.childNodes].map((column) =>
              column.props.isSelectionCell ? (
                <div key={column.key}>SelectionCell</div>
              ) : (
                // <TableSelectAllCell
                //   key={column.key}
                //   column={column}
                //   state={state}
                // />
                <TableColumnHeader
                  key={column.key}
                  column={column}
                  state={state}
                />
              )
            )}
          </TableHeaderRow>
        ))}
      </TableRowGroup>
      <TableRowGroup type="tbody">
        {[...collection.body.childNodes].map((row) => (
          <TableRow key={row.key} item={row} state={state}>
            {[...row.childNodes].map((cell) =>
              cell.props.isSelectionCell ? (
                <div key={cell.key}>Checkbox</div>
              ) : (
                // <TableCheckboxCell key={cell.key} cell={cell} state={state} />
                <TableCell key={cell.key} cell={cell} state={state} />
              )
            )}
          </TableRow>
        ))}
      </TableRowGroup>
    </table>
  );
}

const TableComponent = forwardRef(TableRender) as TableComponentProp;

type CompoundedComponent = typeof TableComponent & {
  Header: typeof TableHeader;
  Body: typeof TableBody;
  Column: typeof Column;
  Row: typeof Row;
  Cell: typeof Cell;
};

export const Table = TableComponent as CompoundedComponent;

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Column = Column;
Table.Row = Row;
Table.Cell = Cell;
