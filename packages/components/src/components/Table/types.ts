import type { ComponentRef, CSSProperties, ReactElement } from 'react';

import type { TableStateProps } from '@koobiq/react-primitives';

export type TableProps<T> = {
  /** Inline styles. */
  style?: CSSProperties;
} & TableStateProps<T>;

export type TableComponentProp = <T extends object>(
  props: TableProps<T>
) => ReactElement | null;

export type TableRef = ComponentRef<'table'>;
