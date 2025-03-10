'use client';

import type { ComponentPropsWithRef, ElementType } from 'react';

import { clsx, polymorphicForwardRef } from '@koobiq/react-core';
import type { ButtonBaseProps as ButtonPrimitiveProps } from '@koobiq/react-primitives';
import { Button as ButtonPrimitive } from '@koobiq/react-primitives';

import s from './Button.module.css';
import type { ButtonBaseProps } from './types.js';

export const Button = polymorphicForwardRef<'button', ButtonBaseProps>(
  (
    {
      as: Tag = 'button',
      variant = 'contrast-filled',
      onlyIcon = false,
      fullWidth = false,
      progress = false,
      disabled = false,
      children,
      startIcon,
      endIcon,
      className,
      ...other
    },
    ref
  ) => {
    const iconOnly = (!children || onlyIcon) && (startIcon || endIcon);

    const classNameFn: ButtonPrimitiveProps['className'] = ({
      hovered,
      disabled,
      loading,
      focusVisible,
      pressed,
    }) =>
      clsx(
        s.base,
        variant && s[variant],
        hovered && s.hovered,
        pressed && s.pressed,
        onlyIcon && s.onlyIcon,
        disabled && s.disabled,
        loading && s.progress,
        fullWidth && s.fullWidth,
        focusVisible && s.focusVisible,
        className
      );

    return (
      <ButtonPrimitive
        as={Tag}
        loading={progress}
        disabled={disabled}
        className={classNameFn}
        {...other}
        ref={ref}
      >
        <span className={s.content}>
          {iconOnly}
          {!iconOnly && (
            <>
              {startIcon}
              <span className={s.label}>{children}</span>
              {endIcon}
            </>
          )}
        </span>
        {progress && <div className={s.loader} />}
      </ButtonPrimitive>
    );
  }
);

Button.displayName = 'Button';

export type ButtonProps<As extends ElementType = 'button'> =
  ComponentPropsWithRef<typeof Button<As>>;
