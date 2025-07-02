import type { ComponentPropsWithRef, ElementType } from 'react';

import { deprecate } from '@koobiq/logger';
import { clsx, polymorphicForwardRef } from '@koobiq/react-core';

import s from './Badge.module.css';
import type { BadgeBaseProps } from './index';

export const Badge = polymorphicForwardRef<'span', BadgeBaseProps>(
  (props, ref) => {
    const {
      variant = 'fade-contrast',
      as: Tag = 'span',
      size = 'normal',
      className,
      startIcon,
      endIcon,
      label,
      children,
      ...other
    } = props;

    if (process.env.NODE_ENV !== 'production' && 'label' in props) {
      deprecate(
        'Badge: the "label" prop is deprecated. Use "children" prop to replace it.'
      );
    }

    // Prefer `children`, fallback to deprecated `label`
    const content = children ?? label;

    return (
      <Tag
        data-size={size}
        data-variant={variant}
        className={clsx(s.base, s[size], s[variant], className)}
        {...other}
        ref={ref}
      >
        {startIcon}
        <span className={s.label}>{content}</span>
        {endIcon}
      </Tag>
    );
  }
);

export type BadgeProps<As extends ElementType = 'span'> = ComponentPropsWithRef<
  typeof Badge<As>
>;
