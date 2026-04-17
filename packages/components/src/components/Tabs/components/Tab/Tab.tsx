'use client';

import type { ElementType, Ref } from 'react';

import { type Node, useFocusRing } from '@koobiq/react-core';
import { useHover, mergeProps, clsx, useDOMRef } from '@koobiq/react-core';
import type { TabListState } from '@koobiq/react-primitives';
import { useTab } from '@koobiq/react-primitives';

import s from './Tab.module.css';

export type TabProps<T> = {
  item: Node<T>;
  state: TabListState<T>;
  innerRef: Ref<HTMLElement>;
  onFocused?: () => void;
};

export function Tab<T>({ item, state, innerRef, onFocused }: TabProps<T>) {
  const { key, rendered } = item;

  const domRef = useDOMRef<HTMLElement>(innerRef);
  const { tabProps, isSelected, isDisabled } = useTab({ key }, state, domRef);

  const { href, className, style, 'data-testid': dataTestId } = item.props;

  const { hoverProps, isHovered } = useHover({
    isDisabled: isDisabled || isSelected,
  });

  const { isFocusVisible, focusProps } = useFocusRing();

  const Tag: ElementType = href ? 'a' : 'div';

  return (
    <Tag
      style={style}
      className={clsx(
        s.base,
        isHovered && s.hovered,
        isDisabled && s.disabled,
        isFocusVisible && s.focusVisible,
        className
      )}
      data-testid={dataTestId}
      data-hovered={isHovered || undefined}
      data-disabled={isDisabled || undefined}
      data-selected={isSelected || undefined}
      data-focus-visible={isFocusVisible || undefined}
      {...mergeProps(hoverProps, focusProps, tabProps, { onFocus: onFocused })}
      ref={domRef as any}
    >
      <span className={s.content}>{rendered}</span>
    </Tag>
  );
}
