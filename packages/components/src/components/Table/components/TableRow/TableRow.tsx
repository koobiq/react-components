'use client';

import { type ReactNode, useRef } from 'react';

import { useFocusRing, mergeProps, useHover, clsx } from '@koobiq/react-core';
import { useTableRow } from '@koobiq/react-primitives';
import type { TableState, GridRowProps } from '@koobiq/react-primitives';

import s from './TableRow.module.css';

type TableRowProps<T> = {
  item: GridRowProps<T>['node'];
  children: ReactNode;
  state: TableState<T>;
};

export function TableRow<T>({ item, children, state }: TableRowProps<T>) {
  const ref = useRef<HTMLTableRowElement | null>(null);
  const isSelected = state.selectionManager.isSelected(item.key);

  const { rowProps, isPressed, isDisabled } = useTableRow(
    {
      node: item,
    },
    state,
    ref
  );

  const { style, className } = item.props;

  const { isFocusVisible, focusProps } = useFocusRing();
  const { isHovered, hoverProps } = useHover({ isDisabled });

  return (
    <tr
      className={clsx(
        s.base,
        isHovered && s.hovered,
        isPressed && s.pressed,
        isSelected && s.selected,
        isDisabled && s.disabled,
        isFocusVisible && s.focusVisible,
        className
      )}
      data-hovered={isHovered || undefined}
      data-disabled={isDisabled || undefined}
      data-selected={isSelected || undefined}
      data-pressed={isPressed || undefined}
      data-focus-visible={isFocusVisible || undefined}
      {...mergeProps(rowProps, hoverProps, focusProps)}
      style={style}
      ref={ref}
    >
      {children}
    </tr>
  );
}
