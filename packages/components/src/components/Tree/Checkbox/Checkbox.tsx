'use client';

import { forwardRef, type ComponentRef } from 'react';

import { clsx, isNotNil, mergeProps } from '@koobiq/react-core';
import { IconCheckS16, IconMinusS16 } from '@koobiq/react-icons';
import { Checkbox as AriaCheckbox } from 'react-aria-components';

import { AnimatedIcon } from '../../AnimatedIcon';
import { useCheckboxGroupState } from '../../CheckboxGroup/CheckboxGroupContext';

import s from './Checkbox.module.css';
import type { CheckboxProps } from './index';

export const Checkbox = forwardRef<ComponentRef<'label'>, CheckboxProps>(
  (props, ref) => {
    const {
      size: sizeProp,
      labelPlacement = 'end',
      children,
      className,
      slotProps,
      ...other
    } = props;

    const { size: sizeState } = useCheckboxGroupState();

    const size = sizeProp || sizeState || 'normal';

    const boxProps = mergeProps({ className: s.checkbox }, slotProps?.box);
    const labelProps = slotProps?.label;

    return (
      <AriaCheckbox
        data-size={size}
        data-label-placement={labelPlacement}
        className={({
          isInvalid,
          isSelected,
          isHovered,
          isReadOnly,
          isDisabled,
          isFocusVisible,
          isIndeterminate,
        }) =>
          clsx(
            s.base,
            s[size],
            s[labelPlacement],
            isInvalid && s.invalid,
            isHovered && s.hovered,
            isReadOnly && s.readOnly,
            isDisabled && s.disabled,
            isSelected && s.selected,
            isFocusVisible && s.focusVisible,
            isIndeterminate && s.indeterminate,
            className
          )
        }
        {...other}
        ref={ref}
      >
        {({ isSelected, isIndeterminate }) => {
          // unchecked = -1, checked = 0, indeterminate = 1,
          const activeIndex = isIndeterminate
            ? 1
            : Number(Boolean(isSelected)) - 1;

          return (
            <>
              <span {...boxProps}>
                <AnimatedIcon
                  icons={[
                    <IconCheckS16 key="checked" />,
                    <IconMinusS16 key="indeterminate" />,
                  ]}
                  activeIndex={activeIndex}
                />
              </span>
              {isNotNil(children) && <span {...labelProps}>{children}</span>}
            </>
          );
        }}
      </AriaCheckbox>
    );
  }
);

Checkbox.displayName = 'Checkbox';
