'use client';

import type { ComponentPropsWithRef, ElementType } from 'react';

import { deprecate } from '@koobiq/logger';
import { clsx, polymorphicForwardRef } from '@koobiq/react-core';
import type { ButtonBaseProps as ButtonPrimitiveProps } from '@koobiq/react-primitives';
import { Button as ButtonPrimitive } from '@koobiq/react-primitives';

import s from './IconButton.module.css';
import type { IconButtonBaseProps } from './types.js';

export const IconButton = polymorphicForwardRef<'button', IconButtonBaseProps>(
  (
    {
      as: Tag = 'button',
      variant = 'theme',
      size = 'xl',
      compact = false,
      disabled = false,
      isCompact: isCompactProp = false,
      isDisabled: isDisabledProp = false,
      children,
      className,
      ...other
    },
    ref
  ) => {
    const isCompact = isCompactProp || compact;
    const isDisabled = isDisabledProp || disabled;

    if (process.env.NODE_ENV !== 'production' && compact) {
      deprecate(
        'IconButton. The "compact" prop is deprecated. Use "isCompact" prop to replace it.'
      );
    }

    if (process.env.NODE_ENV !== 'production' && disabled) {
      deprecate(
        'IconButton. The "disabled" prop is deprecated. Use "isDisabled" prop to replace it.'
      );
    }

    const classNameFn: ButtonPrimitiveProps['className'] = ({
      isHovered,
      isDisabled,
      isLoading,
      isFocusVisible,
      isPressed,
    }) =>
      clsx(
        s.base,
        size && s[size],
        variant && s[variant],
        isHovered && s.hovered,
        isPressed && s.pressed,
        isDisabled && s.disabled,
        isLoading && s.progress,
        isCompact && s.compact,
        isFocusVisible && s.focusVisible,
        className
      );

    return (
      <ButtonPrimitive
        as={Tag}
        isDisabled={isDisabled}
        className={classNameFn}
        {...other}
        ref={ref}
      >
        {children}
      </ButtonPrimitive>
    );
  }
);

IconButton.displayName = 'IconButton';

export type IconButtonProps<As extends ElementType = 'button'> =
  ComponentPropsWithRef<typeof IconButton<As>>;
