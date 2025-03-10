'use client';

import type { ComponentPropsWithRef, ElementType } from 'react';

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
      children,
      className,
      ...other
    },
    ref
  ) => {
    const classNameFn: ButtonPrimitiveProps['className'] = ({
      hovered,
      disabled,
      loading,
      focusVisible,
      pressed,
    }) =>
      clsx(
        s.base,
        size && s[size],
        variant && s[variant],
        hovered && s.hovered,
        pressed && s.pressed,
        disabled && s.disabled,
        loading && s.progress,
        compact && s.compact,
        focusVisible && s.focusVisible,
        className
      );

    return (
      <ButtonPrimitive
        as={Tag}
        disabled={disabled}
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
