'use client';

import { forwardRef, useEffect, useRef } from 'react';

import {
  clsx,
  useHover,
  useDOMRef,
  mergeProps,
  useMultiRef,
  useFocusRing,
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
    const { disabled } = props;
    const domRef = useDOMRef<ButtonToggleRef>(ref);
    const innerRef = useRef<HTMLSpanElement | null>(null);
    const contentRef = useRef<HTMLSpanElement | null>(null);

    const { state, setSelectedRect, animated, equalItemSize } =
      useButtonToggleGroupContext();

    const {
      buttonProps,
      isPressed: pressed,
      isSelected: selected,
    } = useToggleButtonGroupItem(
      { ...props, isDisabled: disabled },
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
        const selectedRect = innerRef.current?.getBoundingClientRect();

        setSelectedRect(selectedRect);
      }
    }, [selected]);

    const overflowX =
      (contentRef.current?.scrollWidth || 0) >
      (contentRef.current?.clientWidth || 0);

    return (
      <Tooltip
        delay={300}
        anchorRef={innerRef}
        disabled={!overflowX}
        control={({ ref: controlRef, ...controlProps }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const rootRef = useMultiRef([ref, controlRef]);

          return (
            <button
              {...mergeProps(controlProps, focusProps, hoverProps, buttonProps)}
              className={clsx(
                s.base,
                textNormalMedium,
                hovered && s.hovered,
                pressed && s.pressed,
                selected && s.selected,
                animated && s.animated,
                disabled && s.disabled,
                focusVisible && s.focusVisible,
                equalItemSize && s.equalItemSize
              )}
              data-pressed={pressed}
              data-selected={selected}
              ref={rootRef}
            >
              <span className={s.inner} ref={innerRef}>
                {props.icon}
                <span className={s.content} ref={contentRef}>
                  {props.children}
                </span>
              </span>
            </button>
          );
        }}
      >
        {props.children}
      </Tooltip>
    );
  }
);

ButtonToggle.displayName = 'ButtonToggle';
