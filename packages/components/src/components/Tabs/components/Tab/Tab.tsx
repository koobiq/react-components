'use client';

import type { ElementType, Ref } from 'react';

import { type Node, isNotNil, useFocusRing } from '@koobiq/react-core';
import { useHover, mergeProps, clsx, useDOMRef } from '@koobiq/react-core';
import type { TabListState } from '@koobiq/react-primitives';
import { useTab } from '@koobiq/react-primitives';

import type { TabProps as TabItemProps } from '../../Tab';
import s from '../../Tabs.module.css';

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

  const {
    href,
    className,
    style,
    slotProps,
    startAddon,
    endAddon,
    onlyIcon: onlyIconProp = false,
    'data-testid': dataTestId,
  } = item.props as TabItemProps<T>;

  const onlyIcon =
    Boolean(onlyIconProp) && (isNotNil(startAddon) || isNotNil(endAddon));

  const { hoverProps, isHovered } = useHover({
    isDisabled: isDisabled || isSelected,
  });

  const { isFocusVisible, focusProps } = useFocusRing();

  const contentProps = mergeProps({ className: s.content }, slotProps?.content);
  const labelProps = mergeProps({ className: s.label }, slotProps?.label);

  const startAddonProps = mergeProps(
    { className: s.addon },
    slotProps?.startAddon
  );

  const endAddonProps = mergeProps({ className: s.addon }, slotProps?.endAddon);

  const Tag: ElementType = href ? 'a' : 'div';

  return (
    <Tag
      style={style}
      className={clsx(
        s.tab,
        isHovered && s.hovered,
        isDisabled && s.disabled,
        isSelected && s.selected,
        onlyIcon && s.onlyIcon,
        isFocusVisible && s.focusVisible,
        className
      )}
      data-testid={dataTestId}
      data-hovered={isHovered || undefined}
      data-disabled={isDisabled || undefined}
      data-selected={isSelected || undefined}
      data-onlyicon={onlyIcon || undefined}
      data-focus-visible={isFocusVisible || undefined}
      {...mergeProps(hoverProps, focusProps, tabProps, { onFocus: onFocused })}
      ref={domRef as any}
    >
      <div {...contentProps}>
        {isNotNil(startAddon) && <div {...startAddonProps}>{startAddon}</div>}
        {!onlyIcon && isNotNil(rendered) && (
          <div {...labelProps}>{rendered}</div>
        )}
        {isNotNil(endAddon) && <div {...endAddonProps}>{endAddon}</div>}
      </div>
    </Tag>
  );
}
