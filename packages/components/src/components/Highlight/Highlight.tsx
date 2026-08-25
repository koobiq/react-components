'use client';

import { useMemo } from 'react';
import type { ComponentPropsWithRef, ElementType } from 'react';

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

    return (
      <Tag
        data-variant={variant}
        className={clsx(s.base, s[variant], className)}
        {...other}
        ref={ref}
      >
        {parts.map((part, index) =>
          part.isMatch ? (
            <mark key={index} className={s.mark}>
              {part.text}
            </mark>
          ) : (
            part.text
          )
        )}
      </Tag>
    );
  }
);

Highlight.displayName = 'Highlight';

export type HighlightProps<As extends ElementType = 'span'> =
  ComponentPropsWithRef<typeof Highlight<As>>;
