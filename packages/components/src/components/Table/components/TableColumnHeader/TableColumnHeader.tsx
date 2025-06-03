import { useRef } from 'react';

import { useFocusRing, mergeProps, clsx } from '@koobiq/react-core';
import { useTableColumnHeader } from '@koobiq/react-primitives';
import type {
  TableState,
  AriaTableColumnHeaderProps,
} from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';
import s from '../../Table.module.css';

type TableColumnHeaderProps<T> = {
  column: AriaTableColumnHeaderProps<T>['node'];
  state: TableState<T>;
};

const textNormal = utilClasses.typography['text-normal'];

export function TableColumnHeader<T>({
  column,
  state,
}: TableColumnHeaderProps<T>) {
  const ref = useRef<HTMLTableCellElement | null>(null);

  const { columnHeaderProps } = useTableColumnHeader(
    { node: column },
    state,
    ref
  );

  const { isFocusVisible, focusProps } = useFocusRing();
  const arrowIcon = state.sortDescriptor?.direction === 'ascending' ? '▲' : '▼';

  return (
    <th
      className={clsx(
        s['header-cell'],
        isFocusVisible && s.focusVisible,
        textNormal
      )}
      {...mergeProps(columnHeaderProps, focusProps)}
      style={{
        textAlign: (column.colSpan ?? 0) > 1 ? 'center' : 'left',
      }}
      ref={ref}
    >
      {column.rendered}
      {column.props.allowsSorting && (
        <span
          aria-hidden="true"
          style={{
            padding: '0 2px',
            visibility:
              state.sortDescriptor?.column === column.key
                ? 'visible'
                : 'hidden',
          }}
        >
          {arrowIcon}
        </span>
      )}
    </th>
  );
}
