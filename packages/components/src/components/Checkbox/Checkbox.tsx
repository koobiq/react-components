'use client';

import { forwardRef, type ComponentRef } from 'react';

import { clsx, isNotNil, mergeProps } from '@koobiq/react-core';
import { IconCheckS16, IconMinusS16 } from '@koobiq/react-icons';
import {
  Checkbox as CheckboxPrimitive,
  type CheckboxProps as CheckboxPropsPrimitive,
} from '@koobiq/react-primitives';

import s from './Checkbox.module.css';
import type { CheckboxProps } from './index';

export const Checkbox = forwardRef<ComponentRef<'input'>, CheckboxProps>(
  (props, ref) => {
    const {
      size = 'normal',
      children,
      className,
      caption,
      slotProps,
      indeterminate,
      ...other
    } = props;

    const commonProps: CheckboxPropsPrimitive = {
      indeterminate,
      labelProps: { ...slotProps?.root, 'data-indeterminate': indeterminate },
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
          checked && s.checked,
          hovered && s.hovered,
          disabled && s.disabled,
          focusVisible && s.focusVisible,
          indeterminate && s.indeterminate,
          className
        ),
      ...other,
    };

    const checkboxProps = mergeProps({
      className: s.checkbox,
      ...slotProps?.checkbox,
    });

    const contentProps = mergeProps({
      className: s.content,
      ...slotProps?.content,
    });

    return (
      <CheckboxPrimitive {...commonProps} ref={ref}>
        {({ checked, indeterminate }) => (
          <>
            <div {...checkboxProps}>
              {checked && !indeterminate && <IconCheckS16 />}
              {indeterminate && <IconMinusS16 />}
            </div>
            <div {...contentProps}>
              {isNotNil(children) && <span className={s.text}>{children}</span>}
              {isNotNil(caption) && (
                <span className={s.caption}>{caption}</span>
              )}
            </div>
          </>
        )}
      </CheckboxPrimitive>
    );
  }
);

Checkbox.displayName = 'Checkbox';
