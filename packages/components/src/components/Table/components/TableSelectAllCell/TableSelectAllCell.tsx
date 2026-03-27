'use client';

import { useRef } from 'react';

import { useSsr } from '@koobiq/react-core';
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
  const { isServer } = useSsr();

  const { columnHeaderProps } = useTableColumnHeader(
    { node: column },
    state,
    ref
  );

  const safeColumnHeaderProps = {
    ...columnHeaderProps,
  } as typeof columnHeaderProps & {
    id?: string;
    'data-key'?: string;
  };

  if (isServer) {
    // Selection header props include id/data-key derived from a random internal column key.
    // Omit them during SSR to avoid hydration mismatches.
    // https://github.com/adobe/react-spectrum/blob/main/packages/react-stately/src/table/TableCollection.ts#L36
    delete safeColumnHeaderProps.id;
    delete safeColumnHeaderProps['data-key'];
  }

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
      {...(isServer ? safeColumnHeaderProps : columnHeaderProps)}
      style={{
        inlineSize: layoutState?.getColumnWidth(column.key),
      }}
      ref={ref}
    >
      {content}
    </th>
  );
}
