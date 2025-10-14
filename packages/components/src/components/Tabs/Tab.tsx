import { useRef } from 'react';

import { clsx, type Node } from '@koobiq/react-core';
import { type TabListState, useTab } from '@koobiq/react-primitives';

import s from './Tabs.module.css';

export type TabProps<T> = {
  item: Node<T>;
  state: TabListState<T>;
};

export function Tab<T>({ item, state }: TabProps<T>) {
  const { key, rendered } = item;
  const ref = useRef(null);
  const { tabProps, isSelected } = useTab({ key }, state, ref);

  return (
    <div
      className={clsx(s.tab, isSelected && s.selected)}
      {...tabProps}
      ref={ref}
    >
      {rendered}
    </div>
  );
}
