'use client';

import { useRef } from 'react';

import {
  useTableColumnHeader,
  VisuallyHidden,
  useTableSelectAllCheckbox,
  type AriaTableColumnHeaderProps,
  type TableState,
} from '@koobiq/react-primitives';

import { Checkbox } from '../../../Checkbox';
import s from '../TableColumnHeader/TableColumnHeader.module.css';

type TableSelectAllCellProps<T> = {
  column: AriaTableColumnHeaderProps<T>['node'];
  state: TableState<T>;
};

export function TableSelectAllCell<T>({
  column,
  state,
}: TableSelectAllCellProps<T>) {
  const ref = useRef<HTMLTableCellElement | null>(null);

  const { columnHeaderProps } = useTableColumnHeader(
    { node: column },
    state,
    ref
  );

  const { checkboxProps } = useTableSelectAllCheckbox(state);

  return (
    <th className={s.base} {...columnHeaderProps} ref={ref}>
      {state.selectionManager.selectionMode === 'single' ? (
        <VisuallyHidden>{checkboxProps['aria-label']}</VisuallyHidden>
      ) : (
        <Checkbox {...checkboxProps} />
      )}
    </th>
  );
}
