'use client';

import { forwardRef, useEffect, useRef, useState } from 'react';

import {
  clsx,
  useHover,
  useDOMRef,
  mergeProps,
  useMultiRef,
  useFocusRing,
  isNotNil,
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
      disabled: disabledProp = false,
      children,
      id,
      icon,
      className,
      slotProps,
      ...other
    } = props;

    const domRef = useDOMRef<ButtonToggleRef>(ref);
    const containerRef = useRef<HTMLSpanElement | null>(null);
    const contentRef = useRef<HTMLSpanElement | null>(null);

    const {
      state,
      setSelectedRect,
      animated,
      equalItemSize,
      rootContainerSize,
    } = useButtonToggleGroupContext();

    const [overflowX, setOverflowX] = useState<boolean>(false);

    const {
      buttonProps,
      isPressed: pressed,
      isSelected: selected,
      isDisabled: disabled,
    } = useToggleButtonGroupItem(
      { id, isDisabled: disabledProp },
      state!,
      domRef
    );

    const { hoverProps, isHovered: hovered } = useHover({
      ...props,
      isDisabled: disabled,
    });

    const { focusProps, isFocusVisible: focusVisible } = useFocusRing({});

    useEffect(() => {
      if (selected && setSelectedRect) {
        const selectedRect = containerRef.current?.getBoundingClientRect();

        setSelectedRect(selectedRect);
      }
    }, [selected]);

    useEffect(() => {
      setOverflowX(
        (contentRef.current?.scrollWidth || 0) >
          (contentRef.current?.clientWidth || 0)
      );
    }, [rootContainerSize]);

    return (
      <Tooltip
        delay={300}
        anchorRef={domRef}
        disabled={!overflowX}
        {...slotProps?.tooltip}
        control={({ ref: controlRef, ...controlProps }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const rootRef = useMultiRef([domRef, controlRef]);

          const rootProps = mergeProps(
            {
              className: clsx(
                s.base,
                textNormalMedium,
                hovered && s.hovered,
                pressed && s.pressed,
                selected && s.selected,
                animated && s.animated,
                disabled && s.disabled,
                focusVisible && s.focusVisible,
                equalItemSize && s.equalItemSize,
                className
              ),
              'data-pressed': pressed,
              'data-selected': selected,
              ref: rootRef,
            },
            controlProps,
            focusProps,
            hoverProps,
            buttonProps,
            other
          );

          const iconProps = mergeProps({ className: s.icon }, slotProps?.icon);

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
