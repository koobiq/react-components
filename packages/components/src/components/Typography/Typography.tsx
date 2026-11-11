import type { ComponentPropsWithRef, ElementType } from 'react';

import { deprecate } from '@koobiq/logger';
import { clsx, polymorphicForwardRef } from '@koobiq/react-core';

import { utilClasses } from '../../styles/utility';

import type { TypographyBaseProps } from './types.js';
import s from './Typography.module.css';

const foregroundColor = utilClasses.color.foreground;
const textVariant = utilClasses.typography;

/**
 * Typography is a component that consistently styles text in an application and
 * manages it in accordance with the rules of the design-system.
 */
export const Typography = polymorphicForwardRef<'p', TypographyBaseProps>(
  (
    {
      variant = 'text-normal',
      color = 'contrast',
      as: Tag = 'p',
      children,
      ellipsis,
      display,
      align,
      className,
      ...other
    },
    ref
  ) => {
    if (process.env.NODE_ENV !== 'production' && color === 'error-less') {
      deprecate(
        'The Typography "error-less" color is deprecated. Use "error-tertiary" to replace it.'
      );
    }

    if (process.env.NODE_ENV !== 'production' && color === 'success-less') {
      deprecate(
        'The Typography "success-less" color is deprecated. Use "success-tertiary" to replace it.'
      );
    }

    return (
      <Tag
        data-align={align}
        data-color={color}
        data-variant={variant}
        data-display={display}
        data-ellipsis={ellipsis}
        className={clsx(
          s.base,
          textVariant[variant],
          display && s[display],
          ellipsis && s.ellipsis,
          align && s[`align-${align}`],
          color === 'inherit' ? s['color-inherit'] : foregroundColor[color],
          className
        )}
        {...other}
        ref={ref}
      >
        {children}
      </Tag>
    );
  }
);

Typography.displayName = 'Typography';

export type TypographyProps<As extends ElementType = 'p'> =
  ComponentPropsWithRef<typeof Typography<As>>;
