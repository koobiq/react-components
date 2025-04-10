'use client';

import type { ComponentPropsWithRef, ElementType } from 'react';

import { clsx, polymorphicForwardRef } from '@koobiq/react-core';
import { Link as LinkPrimitive } from '@koobiq/react-primitives';

import s from './Link.module.css';
import type { LinkBaseProps } from './types';

export const Link = polymorphicForwardRef<'a', LinkBaseProps>((props, ref) => {
  const {
    variant = 'text-normal',
    visitable = false,
    pseudo = false,
    disabled,
    as = 'a',
    startIcon,
    endIcon,
    children,
    className,
    ...other
  } = props;

  const hasIcon = Boolean(startIcon || endIcon);

  const elementType = as !== 'a' && as !== 'button' ? `${as}` : undefined;

  return (
    <LinkPrimitive
      as={as}
      disabled={disabled}
      elementType={elementType}
      className={({ hovered, pressed, focusVisible }) =>
        clsx(
          s.base,
          s[variant],
          pseudo && s.pseudo,
          hovered && s.hovered,
          pressed && s.pressed,
          hasIcon && s.hasIcon,
          visitable && s.visitable,
          focusVisible && s.focusVisible,
          className
        )
      }
      {...other}
      ref={ref}
    >
      {startIcon}
      {children}
      {endIcon}
    </LinkPrimitive>
  );
});

Link.displayName = 'Link';

export type LinkProps<As extends ElementType = 'a'> = ComponentPropsWithRef<
  typeof Link<As>
>;
