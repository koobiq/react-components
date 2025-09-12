'use client';

import type { ComponentPropsWithRef, ElementType } from 'react';

import { deprecate } from '@koobiq/logger';
import { clsx, polymorphicForwardRef } from '@koobiq/react-core';
import { Link as LinkPrimitive } from '@koobiq/react-primitives';

import s from './Link.module.css';
import type { LinkBaseProps } from './types';

export const Link = polymorphicForwardRef<'a', LinkBaseProps>((props, ref) => {
  const {
    variant = 'text-normal',
    isPseudo: isPseudoProp,
    isDisabled: isDisabledProp,
    allowVisited: allowVisitedProp,
    visitable,
    pseudo,
    disabled,
    as = 'a',
    startIcon,
    endIcon,
    children,
    className,
    ...other
  } = props;

  const allowVisited = allowVisitedProp ?? visitable;
  const isDisabled = isDisabledProp ?? disabled;
  const isPseudo = isPseudoProp ?? pseudo;

  const hasIcon = Boolean(startIcon || endIcon);

  if (process.env.NODE_ENV !== 'production' && 'visitable' in props) {
    deprecate(
      'Link: the "visitable" prop is deprecated. Use "allowVisited" prop to replace it.'
    );
  }

  if (process.env.NODE_ENV !== 'production' && 'pseudo' in props) {
    deprecate(
      'Link: the "pseudo" prop is deprecated. Use "isPseudo" prop to replace it.'
    );
  }

  if (process.env.NODE_ENV !== 'production' && 'disabled' in props) {
    deprecate(
      'Link: the "disabled" prop is deprecated. Use "isDisabled" prop to replace it.'
    );
  }

  const elementType = as !== 'a' && as !== 'button' ? `${as}` : undefined;

  return (
    <LinkPrimitive
      as={as}
      isDisabled={isDisabled}
      elementType={elementType}
      {...(isDisabled && { tabIndex: -1 })}
      className={({ isHovered, isPressed, isFocusVisible }) =>
        clsx(
          s.base,
          s[variant],
          isPseudo && s.pseudo,
          isHovered && s.hovered,
          isPressed && s.pressed,
          hasIcon && s.hasIcon,
          allowVisited && s.allowVisited,
          isFocusVisible && s.focusVisible,
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
