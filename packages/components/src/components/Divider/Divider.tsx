'use client';

import type { ComponentPropsWithRef, ElementType } from 'react';

import { clsx, polymorphicForwardRef } from '@koobiq/react-core';
import { useSeparator } from '@koobiq/react-primitives';

import s from './Divider.module.css';
import type { DividerBaseProps } from './index';

export const Divider = polymorphicForwardRef<'div', DividerBaseProps>(
  (props, ref) => {
    const {
      as: Tag = 'div',
      orientation = 'horizontal',
      flexItem = false,
      display,
      className,
      ...other
    } = props;

    const { separatorProps } = useSeparator({ ...other, orientation });

    return (
      <Tag
        {...separatorProps}
        className={clsx(
          s.base,
          s[orientation],
          display && s[display],
          flexItem && s.flexItem,
          className
        )}
        ref={ref}
        {...other}
      />
    );
  }
);

Divider.displayName = 'Divider';

export type DividerProps<As extends ElementType = 'div'> =
  ComponentPropsWithRef<typeof Divider<As>>;
