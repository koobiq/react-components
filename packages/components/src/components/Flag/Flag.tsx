'use client';

import type { AriaAttributes, ComponentPropsWithRef, ElementType } from 'react';

import { clsx, polymorphicForwardRef } from '@koobiq/react-core';

import s from './Flag.module.css';
import type { FlagBaseProps } from './index';

/**
 * Flag is a thin presentational wrapper that decorates a country flag graphic
 * provided by the consumer (inline `svg` or `img`). It holds no flag data.
 */
export const Flag = polymorphicForwardRef<'span', FlagBaseProps>(
  (props, ref) => {
    const {
      as: Tag = 'span',
      shape = 'rectangle',
      shadow = 'inset',
      empty = false,
      decorative = false,
      label,
      className,
      children,
      ...other
    } = props;

    // Accessibility contract:
    // - decorative → hidden from assistive tech, no role/label.
    // - label provided → labelled mode (`role="img"` + accessible name).
    // - Neither → neutral, the projected graphic / surrounding text carries meaning.
    const a11yProps: AriaAttributes & { role?: string } = decorative
      ? { 'aria-hidden': true }
      : label
        ? { role: 'img', 'aria-label': label }
        : {};

    return (
      <Tag
        data-shape={shape}
        data-shadow={shadow}
        data-empty={empty || undefined}
        className={clsx(s.base, className)}
        {...a11yProps}
        {...other}
        ref={ref}
      >
        {children}
      </Tag>
    );
  }
);

export type FlagProps<As extends ElementType = 'span'> = ComponentPropsWithRef<
  typeof Flag<As>
>;
