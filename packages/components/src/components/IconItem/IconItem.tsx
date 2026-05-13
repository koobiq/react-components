import type { ComponentPropsWithRef, ElementType } from 'react';

import { clsx, polymorphicForwardRef } from '@koobiq/react-core';

import { utilClasses } from '../../styles/utility';

import s from './IconItem.module.css';
import type { IconItemBaseProps } from './types';

const textNormal = utilClasses.typography['text-normal'];

/** IconItem is a small colored container for an icon. */
export const IconItem = polymorphicForwardRef<'div', IconItemBaseProps>(
  (props, ref) => {
    const {
      as: Tag = 'div',
      size = 'normal',
      variant = 'solid',
      color = 'theme',
      className,
      children,
      ...other
    } = props;

    return (
      <Tag
        data-size={size}
        data-color={color}
        data-variant={variant}
        className={clsx(
          s.base,
          textNormal,
          s[size],
          s[variant],
          s[color],
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

export type IconItemProps<As extends ElementType = 'div'> =
  ComponentPropsWithRef<typeof IconItem<As>>;
