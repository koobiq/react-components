'use client';

import type { CSSProperties, ReactNode } from 'react';

export type HeaderProps = {
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
export function Header(_props: HeaderProps) {
  return null;
}

Header.getCollectionNode = function* getCollectionNode(props: HeaderProps) {
  const rendered = props.children;

  yield {
    type: 'header',
    textValue: 'header',
    rendered,
    props,
  };
};
