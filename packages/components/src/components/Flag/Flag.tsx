'use client';

import type { ComponentPropsWithRef, CSSProperties, ElementType } from 'react';

import { clsx, polymorphicForwardRef } from '@koobiq/react-core';

import s from './Flag.module.css';
import type { FlagBaseProps } from './index';

/**
 * Flag is a thin presentational wrapper that decorates a country flag graphic
 * provided by the consumer (inline `svg`, `img` or SVG component). It holds no flag data.
 *
 * Flag adds no ARIA semantics on its own. Supply them via standard attributes:
 * `role="img"` + `aria-label` / `aria-labelledby` for a meaningful flag, or
 * `aria-hidden` for a decorative one.
 */
export const Flag = polymorphicForwardRef<'span', FlagBaseProps>(
  (props, ref) => {
    const {
      as: Tag = 'span',
      shape = 'rectangle',
      hideShadow = false,
      size,
      style,
      className,
      children,
      ...other
    } = props;

    const sizeStyle =
      size !== undefined
        ? ({
            ...style,
            '--kbq-flag-size': typeof size === 'number' ? `${size}px` : size,
          } as CSSProperties)
        : style;

    return (
      <Tag
        data-shape={shape}
        data-hide-shadow={hideShadow || undefined}
        className={clsx(s.base, className)}
        style={sizeStyle}
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
