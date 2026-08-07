'use client';

import { forwardRef } from 'react';

import { clsx } from '@koobiq/react-core';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import s from './Markdown.module.css';
import type { MarkdownProps } from './types';

const remarkPlugins = [remarkGfm];

/** Markdown renders a Markdown string as React elements. */
export const Markdown = forwardRef<HTMLDivElement, MarkdownProps>(
  (props, ref) => {
    const { children, className, ...other } = props;

    return (
      <div ref={ref} className={clsx(s.base, className)} {...other}>
        <ReactMarkdown remarkPlugins={remarkPlugins}>{children}</ReactMarkdown>
      </div>
    );
  }
);

Markdown.displayName = 'Markdown';
