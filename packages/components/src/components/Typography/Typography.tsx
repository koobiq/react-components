import { clsx, polymorphicForwardRef } from '@koobiq/react-core';

import type { TypographyBaseProps } from './types.js';
import s from './Typography.module.css';

export const Typography = polymorphicForwardRef<'p', TypographyBaseProps>(
  (
    {
      variant = 'text-normal',
      as: Tag = 'p',
      children,
      ellipsis,
      display,
      align,
      className,
      ...other
    },
    ref
  ) => (
    <Tag
      className={clsx(
        s.base,
        variant && s[variant],
        display && s[display],
        ellipsis && s.ellipsis,
        align && s[`align_${align}`],
        className
      )}
      {...other}
      ref={ref}
    >
      {children}
    </Tag>
  )
);

Typography.displayName = 'Typography';
