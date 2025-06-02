import type { ReactNode, ElementType } from 'react';

import { clsx } from '@koobiq/react-core';
import { useTableRowGroup } from '@koobiq/react-primitives';

import s from './TableRowGroup.module.css';

export type TableRowGroupProps = {
  children: ReactNode;
  type: ElementType;
};

export function TableRowGroup({ type: Element, children }: TableRowGroupProps) {
  const { rowGroupProps } = useTableRowGroup();

  return (
    <Element
      {...rowGroupProps}
      className={clsx(s.base, Element === 'thead' && s.thead)}
    >
      {children}
    </Element>
  );
}
