import type { ComponentRef, CSSProperties, ReactElement, Ref } from 'react';

import type { TableStateProps } from '@koobiq/react-primitives';

export const tablePropDivider = ['none', 'row', 'column'] as const;

export type TablePropDivider = (typeof tablePropDivider)[number];

export type TableProps<T> = {
  /** Inline styles. */
  style?: CSSProperties;
  /** Additional CSS-classes. */
  className?: string;
  /**
   * Type of separators in the table.
   * @default none
   */
  divider?: TablePropDivider;
  /** Ref to the control */
  ref?: Ref<HTMLTableElement>;
} & TableStateProps<T>;

export type TableComponentProp = <T extends object>(
  props: TableProps<T>
) => ReactElement | null;

export type TableRef = ComponentRef<'table'>;
