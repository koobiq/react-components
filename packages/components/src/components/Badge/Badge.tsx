import type { ComponentPropsWithRef, ElementType } from 'react';

import { deprecate } from '@koobiq/logger';
import { clsx, isNotNil, polymorphicForwardRef } from '@koobiq/react-core';

import s from './Badge.module.css';
import type { BadgeBaseProps } from './index';

export const Badge = polymorphicForwardRef<'span', BadgeBaseProps>(
  (
    {
      variant = 'fade-contrast',
      as: Tag = 'span',
      size = 'normal',
      className,
      startIcon,
      endIcon,
      label,
      children,
      ...other
    },
    ref
  ) => {
    if (process.env.NODE_ENV !== 'production' && isNotNil(label)) {
      deprecate(
        'Badge. The "label" prop is deprecated. Use "children" prop to replace it.'
      );
    }

    return (
      <Tag
        data-variant={variant}
        data-size={size}
        {...other}
        ref={ref}
        className={clsx(s.base, s[size], s[variant], className)}
      >
        {startIcon}
        <span className={s.label}>{children ?? label}</span>
        {endIcon}
      </Tag>
    );
  }
);

export type BadgeProps<As extends ElementType = 'span'> = ComponentPropsWithRef<
  typeof Badge<As>
>;
