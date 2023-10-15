import { clsx, polymorphicForwardRef } from '@koobiq/react-core';

import s from './Badge.module.css';
import type { BadgeBaseProps } from './types';

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
      ...props
    },
    ref
  ) => (
    <Tag
      {...props}
      ref={ref}
      className={clsx(s.base, s[size], s[variant], className)}
    >
      {startIcon}
      <span className={s.label}>{label}</span>
      {endIcon}
    </Tag>
  )
);
