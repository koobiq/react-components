import type { ComponentPropsWithRef, ElementType } from 'react';

import { clsx, polymorphicForwardRef } from '@koobiq/react-core';
import { Text } from '@koobiq/react-primitives';

import { utilClasses } from '../../styles/utility';

import type { TypographyBaseProps } from './types.js';
import s from './Typography.module.css';

const foregroundColor = utilClasses.color.foreground;
const textVariant = utilClasses.typography;

export const Typography = polymorphicForwardRef<'p', TypographyBaseProps>(
  (
    {
      variant = 'text-normal',
      color = 'contrast',
      as = 'p',
      children,
      ellipsis,
      display,
      align,
      className,
      ...other
    },
    ref
  ) => (
    <Text
      as={as}
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
    </Text>
  )
);

Typography.displayName = 'Typography';

export type TypographyProps<As extends ElementType = 'p'> =
  ComponentPropsWithRef<typeof Typography<As>>;
