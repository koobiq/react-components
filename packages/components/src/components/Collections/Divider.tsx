'use client';

import type { CSSProperties, ReactNode } from 'react';

export type DividerProps = {
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
  children?: ReactNode;
  key?: string | number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Divider(_props: DividerProps) {
  return null;
}

Divider.getCollectionNode = function* getCollectionNode(props: DividerProps) {
  yield {
    type: 'divider',
    textValue: 'divider',
    props,
  };
};
