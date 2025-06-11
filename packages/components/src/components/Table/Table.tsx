import type { ComponentPropsWithRef, CSSProperties, Ref } from 'react';
import { forwardRef, useRef } from 'react';

import {
  clsx,
  useDOMRef,
  mergeProps,
  useElementSize,
} from '@koobiq/react-core';
import type { DataAttributeProps } from '@koobiq/react-core';
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
} from './components';
import s from './Table.module.css';
import type { TableComponentProp, TableProps, TableRef } from './types';
import { normalizeBlockSize } from './utils';

const textNormal = utilClasses.typography['text-normal'];

function TableRender<T extends object>(
  props: TableProps<T>,
  ref?: Ref<TableRef>
) {
  const {
    stickyHeader = false,
    fullWidth = false,
    selectionMode,
    selectionBehavior,
    divider = 'none',
    className,
    blockSize,
    maxBlockSize,
    minBlockSize,
    style: styleProp,
  } = props;

  const state = useTableState({
    ...props,
    showSelectionCheckboxes:
      selectionMode === 'multiple' && selectionBehavior !== 'replace',
  });

  const domRef = useDOMRef<HTMLTableElement>(ref);
  const tableRef = useRef<HTMLTableElement>(null);

  const { collection } = state;
  const { gridProps } = useTable(props, state, tableRef);

  const tableProps = mergeProps(
    { ref: tableRef, className: clsx(s.table) },
    gridProps
  );

  const { ref: theadRef, height } = useElementSize();

  const containerProps: ComponentPropsWithRef<'div'> & DataAttributeProps = {
    className: clsx(s.base, fullWidth && s.fullWidth, textNormal, className),
    'data-divider': divider,
    'data-fullwidth': fullWidth,
    'data-sticky-header': stickyHeader,
    style: {
      ...styleProp,
      '--table-container-block-size': normalizeBlockSize(blockSize),
      '--table-container-min-block-size': normalizeBlockSize(minBlockSize),
      '--table-container-max-block-size': normalizeBlockSize(maxBlockSize),
      '--table-container-scroll-padding-top': `${height}px`,
    } as CSSProperties,
    ref: domRef,
  };

  return (
    <div {...containerProps}>
      <table {...tableProps}>
        <TableRowGroup type="thead" ref={theadRef}>
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
                  <TableCheckboxCell key={cell.key} cell={cell} state={state} />
                ) : (
                  <TableCell key={cell.key} cell={cell} state={state} />
                )
              )}
            </TableRow>
          ))}
        </TableRowGroup>
      </table>
    </div>
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
