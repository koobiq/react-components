'use client';

import type { Node } from '@koobiq/react-core';

export type MenuHeaderProps<T> = {
  item: Node<T>;
};

export function MenuHeader<T>({ item }: MenuHeaderProps<T>) {
  const { key, rendered, props } = item;

  return (
    <header key={key} role="presentation" {...props}>
      {rendered}
    </header>
  );
}
