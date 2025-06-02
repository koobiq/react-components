import type { ReactNode, ElementType } from 'react';

import { useTableRowGroup } from '@koobiq/react-primitives';

export type TableRowGroupProps = {
  children: ReactNode;
  type: ElementType;
};

export function TableRowGroup({ type: Element, children }: TableRowGroupProps) {
  const { rowGroupProps } = useTableRowGroup();

  return (
    <Element
      {...rowGroupProps}
      style={
        Element === 'thead'
          ? { borderBottom: '2px solid var(--spectrum-global-color-gray-800)' }
          : null
      }
    >
      {children}
    </Element>
  );
}
