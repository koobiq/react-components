'use client';

import { forwardRef } from 'react';

import { clsx } from '@koobiq/react-core';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { utilClasses } from '../../styles/utility';

import { MarkdownTable } from './components';
import s from './Markdown.module.css';
import type { MarkdownProps } from './types';

const { nativeScrollbarDescendants } = utilClasses;

const remarkPlugins = [remarkGfm];

const components = { table: MarkdownTable };

/** Markdown renders a Markdown string as React elements. */
export const Markdown = forwardRef<HTMLDivElement, MarkdownProps>(
  (props, ref) => {
    const { children, className, ...other } = props;

    return (
      <div
        ref={ref}
        className={clsx(s.base, nativeScrollbarDescendants, className)}
        {...other}
      >
        <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
          {children}
        </ReactMarkdown>
      </div>
    );
  }
);

Markdown.displayName = 'Markdown';
