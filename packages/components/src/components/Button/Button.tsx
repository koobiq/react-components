'use client';

import type { ComponentPropsWithRef, ElementType } from 'react';

import { deprecate } from '@koobiq/logger';
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
      isLoading: isLoadingProp = false,
      isDisabled: isDisabledProp = false,
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
    const isLoading = isLoadingProp || progress;
    const isDisabled = isDisabledProp || disabled;

    if (process.env.NODE_ENV !== 'production' && progress) {
      deprecate(
        'Button. The "progress" prop is deprecated. Use "isLoading" prop to replace it.'
      );
    }

    if (process.env.NODE_ENV !== 'production' && disabled) {
      deprecate(
        'Button. The "disabled" prop is deprecated. Use "isDisabled" prop to replace it.'
      );
    }

    const iconOnly = (!children || onlyIcon) && (startIcon || endIcon);

    const classNameFn: ButtonPrimitiveProps['className'] = ({
      isHovered,
      isDisabled,
      isLoading,
      isPressed,
      isFocusVisible,
    }) =>
      clsx(
        s.base,
        variant && s[variant],
        isHovered && s.hovered,
        isPressed && s.pressed,
        onlyIcon && s.onlyIcon,
        isDisabled && s.disabled,
        isLoading && s.loading,
        fullWidth && s.fullWidth,
        isFocusVisible && s.focusVisible,
        className
      );

    return (
      <ButtonPrimitive
        as={Tag}
        isLoading={isLoading}
        isDisabled={isDisabled}
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
        {isLoading && <div className={s.loader} />}
      </ButtonPrimitive>
    );
  }
);

Button.displayName = 'Button';

export type ButtonProps<As extends ElementType = 'button'> =
  ComponentPropsWithRef<typeof Button<As>>;
