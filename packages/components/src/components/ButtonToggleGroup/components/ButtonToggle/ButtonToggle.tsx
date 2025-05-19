'use client';

import { forwardRef, useEffect, useRef } from 'react';

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
    const { disabled: disabledProp = false, children, icon, className } = props;
    const domRef = useDOMRef<ButtonToggleRef>(ref);
    const containerRef = useRef<HTMLSpanElement | null>(null);
    const contentRef = useRef<HTMLSpanElement | null>(null);

    const { state, setSelectedRect, animated, equalItemSize } =
      useButtonToggleGroupContext();

    const {
      buttonProps,
      isPressed: pressed,
      isSelected: selected,
      isDisabled: disabled,
    } = useToggleButtonGroupItem(
      { ...props, isDisabled: disabledProp },
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

    const overflowX =
      (contentRef.current?.scrollWidth || 0) >
      (contentRef.current?.clientWidth || 0);

    return (
      <Tooltip
        delay={300}
        anchorRef={domRef}
        disabled={!overflowX}
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
            buttonProps
          );

          const iconProps = { className: s.icon };
          const containerProps = { className: s.container, ref: containerRef };
          const contentProps = { className: s.content, ref: contentRef };

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
