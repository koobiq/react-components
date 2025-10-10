'use client';

import { useRef } from 'react';

import {
  useTableColumnHeader,
  VisuallyHidden,
  useTableSelectAllCheckbox,
  type AriaTableColumnHeaderProps,
  type TableState,
  type TableColumnResizeState,
} from '@koobiq/react-primitives';

import { Checkbox } from '../../../Checkbox';
import s from '../TableColumnHeader/TableColumnHeader.module.css';

type TableSelectAllCellProps<T> = {
  column: AriaTableColumnHeaderProps<T>['node'];
  state: TableState<T>;
  layoutState?: TableColumnResizeState<T>;
};

export function TableSelectAllCell<T>({
  column,
  state,
  layoutState,
}: TableSelectAllCellProps<T>) {
  const ref = useRef<HTMLTableCellElement | null>(null);

  const { columnHeaderProps } = useTableColumnHeader(
    { node: column },
    state,
    ref
  );

  const { checkboxProps } = useTableSelectAllCheckbox(state);

  return (
    <th
      className={s.base}
      {...columnHeaderProps}
      style={{
        inlineSize: layoutState?.getColumnWidth(column.key),
      }}
      ref={ref}
    >
      {state.selectionManager.selectionMode === 'single' ? (
        <VisuallyHidden>{checkboxProps['aria-label']}</VisuallyHidden>
      ) : (
        <Checkbox {...checkboxProps} />
      )}
    </th>
  );
}
