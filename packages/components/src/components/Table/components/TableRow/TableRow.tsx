import { type ReactNode, useRef } from 'react';

import { useFocusRing, mergeProps } from '@koobiq/react-core';
import { useTableRow } from '@koobiq/react-primitives';
import type { TableState, GridRowProps } from '@koobiq/react-primitives';

import { getBackground } from './utils';

type TableRowProps<T> = {
  item: GridRowProps<T>['node'];
  children: ReactNode;
  state: TableState<T>;
};

export function TableRow<T>({ item, children, state }: TableRowProps<T>) {
  const ref = useRef<HTMLTableRowElement | null>(null);
  const isSelected = state.selectionManager.isSelected(item.key);

  const { rowProps, isPressed } = useTableRow(
    {
      node: item,
    },
    state,
    ref
  );

  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <tr
      style={{
        background: getBackground(isSelected, isPressed, item.index),
        color: isSelected ? 'white' : undefined,
        outline: 'none',
        boxShadow: isFocusVisible ? 'inset 0 0 0 2px orange' : 'none',
        cursor: 'default',
      }}
      {...mergeProps(rowProps, focusProps)}
      ref={ref}
    >
      {children}
    </tr>
  );
}
