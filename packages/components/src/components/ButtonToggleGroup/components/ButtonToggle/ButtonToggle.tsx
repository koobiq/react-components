'use client';

import { forwardRef, useRef } from 'react';

import {
  clsx,
  useHover,
  useDOMRef,
  mergeProps,
  useMultiRef,
  useFocusRing,
  isNotNil,
  useElementSize,
} from '@koobiq/react-core';
import { useToggleButtonGroupItem } from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';
import { Tooltip } from '../../../Tooltip';
import { useButtonToggleGroupContext } from '../../ButtonToggleGroupContext';

import s from './ButtonToggle.module.css';
import type { ButtonToggleProps, ButtonToggleRef } from './types';

const textNormalMedium = utilClasses.typography['text-normal-medium'];

export const ButtonToggle = forwardRef<ButtonToggleRef, ButtonToggleProps>(
  (props, ref) => {
    const {
      isDisabled: isDisabledProp = false,
      children,
      id,
      icon,
      className,
      slotProps,
      ...other
    } = props;

    const domRef = useDOMRef<ButtonToggleRef>(ref);

    const contentRef = useRef<HTMLSpanElement | null>(null);

    const { state, savedKey } = useButtonToggleGroupContext();

    const { ref: containerRef } = useElementSize();

    const showTooltip =
      (contentRef.current?.scrollWidth || 0) >
      (contentRef.current?.clientWidth || 0);

    const { buttonProps, isPressed, isSelected, isDisabled } =
      useToggleButtonGroupItem(
        { id, isDisabled: isDisabledProp },
        state!,
        domRef
      );

    const { hoverProps, isHovered } = useHover({ ...props, isDisabled });

    const { focusProps, isFocusVisible } = useFocusRing({});

    const iconProps = mergeProps({ className: s.icon }, slotProps?.icon);

    return (
      <Tooltip
        delay={300}
        anchorRef={domRef}
        disabled={!showTooltip}
        {...slotProps?.tooltip}
        control={({ ref: controlRef, ...controlProps }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const rootRef = useMultiRef([domRef, controlRef]);

          const rootProps = mergeProps(
            {
              className: clsx(
                s.base,
                textNormalMedium,
                isHovered && s.hovered,
                isPressed && s.pressed,
                savedKey === id && s.selected,
                isDisabled && s.disabled,
                isFocusVisible && s.focusVisible,
                className
              ),
              'data-hovered': isHovered,
              'data-pressed': isPressed,
              'data-selected': isSelected,
              'data-disabled': isDisabled,
              'data-focus-visible': isFocusVisible,
              ref: rootRef,
            },
            controlProps,
            focusProps,
            hoverProps,
            buttonProps,
            other
          );

          const containerProps = mergeProps(
            { className: s.container, ref: containerRef },
            slotProps?.container
          );

          const contentProps = mergeProps(
            { className: s.content, ref: contentRef },
            slotProps?.content
          );

          return (
            <button {...rootProps}>
              <span {...containerProps}>
                {isNotNil(icon) && <span {...iconProps}>{icon}</span>}
                {isNotNil(children) && (
                  <span {...contentProps}>{children}</span>
                )}
              </span>
            </button>
          );
        }}
      >
        {children}
      </Tooltip>
    );
  }
);

ButtonToggle.displayName = 'ButtonToggle';
