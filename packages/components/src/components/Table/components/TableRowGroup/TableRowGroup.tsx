import type { ReactNode } from 'react';

import { clsx } from '@koobiq/react-core';
import { useTableRowGroup } from '@koobiq/react-primitives';

import s from '../../Table.module.css';

export type TableRowGroupProps = {
  children: ReactNode;
  type: 'thead' | 'tbody';
};

export function TableRowGroup({
  type = 'thead',
  children,
}: TableRowGroupProps) {
  const Element = type;
  const { rowGroupProps } = useTableRowGroup();

  return (
    <Element {...rowGroupProps} className={clsx(s[type])}>
      {children}
    </Element>
  );
}
