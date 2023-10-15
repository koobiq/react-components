'use client';

import type { ComponentRef } from 'react';

import { clsx, useDOMRef, polymorphicForwardRef } from '@koobiq/react-core';
import { useLink } from '@koobiq/react-primitives';

import s from './Link.module.css';
import type { LinkBaseProps } from './types';

export const Link = polymorphicForwardRef<'a', LinkBaseProps>((props, ref) => {
  const {
    variant = 'text-normal',
    visitable = false,
    pseudo = false,
    as = 'a',
    startIcon,
    endIcon,
    children,
    className,
  } = props;

  const Tag = as;

  const domRef = useDOMRef<ComponentRef<'a'>>(ref);

  const elementType = as !== 'a' && as !== 'button' ? `${as}` : undefined;

  const { linkProps, hovered, pressed, focusVisible } = useLink(
    { ...props, elementType },
    domRef
  );

  const hasIcon = Boolean(startIcon || endIcon);

  return (
    <Tag
      {...linkProps}
      className={clsx(
        s.base,
        s[variant],
        pseudo && s.pseudo,
        hovered && s.hovered,
        pressed && s.pressed,
        hasIcon && s.hasIcon,
        visitable && s.visitable,
        focusVisible && s.focusVisible,
        className
      )}
      ref={domRef}
    >
      {startIcon}
      {children}
      {endIcon}
    </Tag>
  );
});

Link.displayName = 'Link';
