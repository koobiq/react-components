'use client';

import type { ComponentPropsWithRef, ElementType } from 'react';

import { deprecate } from '@koobiq/logger';
import { clsx, polymorphicForwardRef } from '@koobiq/react-core';
import type { ButtonBaseProps as ButtonPrimitiveProps } from '@koobiq/react-primitives';
import { Button as ButtonPrimitive } from '@koobiq/react-primitives';

import { useButtonGroupContext } from '../ButtonGroup';

import s from './Button.module.css';
import type { ButtonBaseProps } from './types.js';

/** The Button is a clickable UI component that triggers actions or events. */
export const Button = polymorphicForwardRef<'button', ButtonBaseProps>(
  (props, ref) => {
    const {
      as: Tag = 'button',
      variant: variantProp,
      onlyIcon,
      fullWidth,
      isLoading: isLoadingProp,
      isDisabled: isDisabledProp,
      progress,
      disabled,
      children,
      startIcon,
      endIcon,
      className,
      ...other
    } = props;

    const group = useButtonGroupContext();

    // The group wins when it's in progress, but a single button can still show its own loader.
    const isLoading = (isLoadingProp ?? progress) || group.isLoading;

    // Inside a group the group's variant wins, so the group looks like one control.
    const variant = group.variant ?? variantProp ?? 'contrast-filled';

    // The group wins when it disables, but a single button can still disable itself.
    const isDisabled = (isDisabledProp ?? disabled) || group.isDisabled;

    if (process.env.NODE_ENV !== 'production' && 'progress' in props) {
      deprecate(
        'Button: the "progress" prop is deprecated. Use "isLoading" prop to replace it.'
      );
    }

    if (process.env.NODE_ENV !== 'production' && 'disabled' in props) {
      deprecate(
        'Button: the "disabled" prop is deprecated. Use "isDisabled" prop to replace it.'
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
        data-variant={variant}
        data-slot="button"
        data-loading={isLoading || undefined}
        data-fullwidth={fullWidth || undefined}
        data-onlyicon={!!iconOnly || undefined}
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
