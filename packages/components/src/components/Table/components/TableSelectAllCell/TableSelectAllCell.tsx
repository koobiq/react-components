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
  hideSelectAll?: boolean;
};

export function TableSelectAllCell<T>({
  column,
  state,
  layoutState,
  hideSelectAll = false,
}: TableSelectAllCellProps<T>) {
  const ref = useRef<HTMLTableCellElement | null>(null);

  const { columnHeaderProps } = useTableColumnHeader(
    { node: column },
    state,
    ref
  );

  const { checkboxProps } = useTableSelectAllCheckbox(state);
  const isSingleSelection = state.selectionManager.selectionMode === 'single';
  let content = null;

  if (isSingleSelection) {
    content = <VisuallyHidden>{checkboxProps['aria-label']}</VisuallyHidden>;
  } else if (!hideSelectAll) {
    content = <Checkbox {...checkboxProps} />;
  }

  return (
    <th
      className={s.base}
      {...columnHeaderProps}
      style={{
        inlineSize: layoutState?.getColumnWidth(column.key),
      }}
      ref={ref}
    >
      {content}
    </th>
  );
}
