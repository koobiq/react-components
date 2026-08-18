'use client';

import { useMemo, type ComponentPropsWithRef, type ElementType } from 'react';

import { clsx, polymorphicForwardRef } from '@koobiq/react-core';

import s from './Highlight.module.css';
import type { HighlightBaseProps } from './types';
import { splitByQuery } from './utils';

/** Highlight marks every occurrence of a search query inside a text. */
export const Highlight = polymorphicForwardRef<'span', HighlightBaseProps>(
  (props, ref) => {
    const {
      as: Tag = 'span',
      variant = 'background',
      text,
      query,
      className,
      ...other
    } = props;

    const parts = useMemo(() => splitByQuery(text, query), [text, query]);

    let offset = 0;

    return (
      <Tag
        data-variant={variant}
        className={clsx(s.base, s[variant], className)}
        {...other}
        ref={ref}
      >
        {parts.map((part) => {
          const key = offset;

          offset += part.text.length;

          return part.isMatch ? (
            <mark key={key} className={s.mark}>
              {part.text}
            </mark>
          ) : (
            part.text
          );
        })}
      </Tag>
    );
  }
);

export type HighlightProps<As extends ElementType = 'span'> =
  ComponentPropsWithRef<typeof Highlight<As>>;
