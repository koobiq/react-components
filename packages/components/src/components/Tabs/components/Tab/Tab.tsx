'use client';

import type { ElementType, KeyboardEvent, Ref } from 'react';

import {
  type Node,
  isNotNil,
  useFocusRing,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';
import { useHover, mergeProps, clsx, useDOMRef } from '@koobiq/react-core';
import { IconXmark16 } from '@koobiq/react-icons';
import type { TabListState } from '@koobiq/react-primitives';
import { useTab } from '@koobiq/react-primitives';

import { IconButton, type IconButtonProps } from '../../../IconButton';
import intlMessages from '../../intl.json';
import type { TabProps as TabItemProps } from '../../Tab';

import s from './Tab.module.css';

type TabOrientation = 'horizontal' | 'vertical';

export type TabProps<T> = {
  item: Node<T>;
  state: TabListState<T>;
  innerRef: Ref<HTMLElement>;
  orientation: TabOrientation;
  isUnderlined?: boolean;
  isStretched?: boolean;
  onFocused?: () => void;
  onRemove?: () => void;
  closeButtonProps?: IconButtonProps;
};

export function Tab<T>({
  item,
  state,
  innerRef,
  orientation,
  isUnderlined = false,
  isStretched = false,
  onFocused,
  onRemove,
  closeButtonProps,
}: TabProps<T>) {
  const { key, rendered } = item;
  const t = useLocalizedStringFormatter(intlMessages);

  const isRemovable = !!onRemove;

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
    isDisabled: isDisabled,
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

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!isRemovable || isDisabled) return;

    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      onRemove?.();
    }
  };

  return (
    <Tag
      style={style}
      className={clsx(
        s.base,
        !isUnderlined && s.default,
        isUnderlined && s.underlined,
        orientation && s[orientation],
        isStretched && s.stretched,
        onlyIcon && s.onlyIcon,
        className
      )}
      data-testid={dataTestId}
      data-orientation={orientation}
      data-hovered={isHovered || undefined}
      data-disabled={isDisabled || undefined}
      data-selected={isSelected || undefined}
      data-onlyicon={onlyIcon || undefined}
      data-closable={isRemovable || undefined}
      data-underlined={isUnderlined || undefined}
      data-focus-visible={isFocusVisible || undefined}
      {...mergeProps(hoverProps, focusProps, tabProps, {
        onFocus: onFocused,
        onKeyDown,
      })}
      ref={domRef as any}
    >
      <div {...contentProps}>
        <span className={s.inner}>
          {isNotNil(startAddon) && <div {...startAddonProps}>{startAddon}</div>}
          {!onlyIcon && isNotNil(rendered) && (
            <div {...labelProps}>{rendered}</div>
          )}
          {isNotNil(endAddon) && <div {...endAddonProps}>{endAddon}</div>}
        </span>
      </div>
      {isRemovable && (
        <span
          className={s.closeButton}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <IconButton
            as="span"
            size="l"
            isCompact
            tabIndex={-1}
            variant="fade-contrast"
            data-slot="close-button"
            aria-label={t.format('remove')}
            isDisabled={isDisabled}
            onPress={() => onRemove?.()}
            {...closeButtonProps}
          >
            <IconXmark16 />
          </IconButton>
        </span>
      )}
    </Tag>
  );
}
