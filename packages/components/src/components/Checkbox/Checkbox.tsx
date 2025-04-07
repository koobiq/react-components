'use client';

import { forwardRef, type ComponentRef } from 'react';

import { clsx, isNotNil, mergeProps } from '@koobiq/react-core';
import { IconCheckS16, IconMinusS16 } from '@koobiq/react-icons';
import {
  Checkbox as CheckboxPrimitive,
  type CheckboxProps as CheckboxPropsPrimitive,
} from '@koobiq/react-primitives';

import { AnimatedIcon } from '../AnimatedIcon';

import s from './Checkbox.module.css';
import type { CheckboxProps } from './index';

export const Checkbox = forwardRef<ComponentRef<'label'>, CheckboxProps>(
  (props, ref) => {
    const {
      size = 'normal',
      labelPlacement = 'end',
      children,
      className,
      slotProps,
      indeterminate,
      ...other
    } = props;

    const commonProps: CheckboxPropsPrimitive = {
      indeterminate,
      className: ({
        error,
        checked,
        hovered,
        disabled,
        focusVisible,
        indeterminate,
      }) =>
        clsx(
          s.base,
          s[size],
          error && s.error,
          s[labelPlacement],
          checked && s.checked,
          hovered && s.hovered,
          disabled && s.disabled,
          focusVisible && s.focusVisible,
          indeterminate && s.indeterminate,
          className
        ),
      ...other,
    };

    const boxProps = mergeProps({ className: s.checkbox }, slotProps?.box);
    const labelProps = slotProps?.label;

    return (
      <CheckboxPrimitive
        data-indeterminate={indeterminate}
        {...commonProps}
        ref={ref}
      >
        {({ checked, indeterminate }) => {
          // unchecked = -1, checked = 0, indeterminate = 1,
          const activeIndex = indeterminate ? 1 : Number(Boolean(checked)) - 1;

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
      </CheckboxPrimitive>
    );
  }
);

Checkbox.displayName = 'Checkbox';
