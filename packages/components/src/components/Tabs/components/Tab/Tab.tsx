'use client';

import type { ElementType, Ref } from 'react';

import type { Node } from '@koobiq/react-core';
import { clsx, useDOMRef } from '@koobiq/react-core';
import type { TabListState } from '@koobiq/react-primitives';
import { useTab } from '@koobiq/react-primitives';

import s from '../../Tabs.module.css';

export type TabProps<T> = {
  item: Node<T>;
  state: TabListState<T>;
  innerRef: Ref<HTMLElement>;
};

export function Tab<T>({ item, state, innerRef }: TabProps<T>) {
  const { key, rendered } = item;

  const domRef = useDOMRef<HTMLElement>(innerRef);
  const { tabProps, isSelected, isDisabled } = useTab({ key }, state, domRef);

  const { href } = item.props;

  const Tag: ElementType = href ? 'a' : 'div';

  return (
    <Tag
      className={clsx(
        s.tab,
        isSelected && s.selected,
        isDisabled && s.disabled
      )}
      data-disabled={isDisabled || undefined}
      data-selected={isSelected || undefined}
      {...tabProps}
      ref={domRef as any}
    >
      <span className={s.tabContent}>{rendered}</span>
    </Tag>
  );
}
