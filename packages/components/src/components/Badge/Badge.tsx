import type { ComponentPropsWithRef, ElementType } from 'react';

import { clsx, polymorphicForwardRef } from '@koobiq/react-core';

import s from './Badge.module.css';
import type { BadgeBaseProps } from './index';

// TODO: integrate usePress for handling press interactions
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
      ...other
    },
    ref
  ) => (
    <Tag
      data-variant={variant}
      data-size={size}
      {...other}
      ref={ref}
      className={clsx(s.base, s[size], s[variant], className)}
    >
      {startIcon}
      <span className={s.label}>{label}</span>
      {endIcon}
    </Tag>
  )
);

export type BadgeProps<As extends ElementType = 'span'> = ComponentPropsWithRef<
  typeof Badge<As>
>;
