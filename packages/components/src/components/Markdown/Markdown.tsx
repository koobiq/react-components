'use client';

import { forwardRef, useMemo } from 'react';

import { clsx, useSsr } from '@koobiq/react-core';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import type { MarkedOptions } from 'marked';

import s from './Markdown.module.css';
import type { MarkdownProps } from './types';

/**
 * Tags whose opening tag gets a class injected, keeping any existing
 * attributes (e.g. GFM table cells carry their own `align` attribute).
 * The lookahead requires a following whitespace, `/`, or `>`, so `th`/`p`
 * don't accidentally match inside `thead`/`pre`.
 */
const TAGS_TO_CLASS_ALIAS = [
  'a',
  'blockquote',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'li',
  'ol',
  'table',
  'tbody',
  'thead',
  'th',
  'td',
  'tr',
  'ul',
  'p',
  'pre',
  'code',
  'img',
] as const;

type MarkdownClassMap = Record<string, string>;

const injectClass = (html: string, tag: string, className: string): string => {
  if (!className) return html;

  // Captures existing attributes (e.g. fenced code blocks emit `<code class="language-js">`)
  // so an existing class attribute is merged into rather than duplicated.
  return html.replaceAll(
    new RegExp(`<${tag}(?=[\\s/>])([^>]*)>`, 'g'),
    (_match, attrs: string) => {
      const classMatch = attrs.match(/\sclass="([^"]*)"/);

      if (classMatch) {
        return `<${tag}${attrs.replace(classMatch[0], ` class="${classMatch[1]} ${className}"`)}>`;
      }

      return `<${tag} class="${className}"${attrs}>`;
    }
  );
};

/** Applies the component's CSS module classes to the raw HTML produced by `marked`. */
const applyMarkdownClasses = (
  html: string,
  classes: MarkdownClassMap
): string => {
  let result = html;

  for (const tag of TAGS_TO_CLASS_ALIAS) {
    result = injectClass(result, tag, classes[tag]);
  }

  return result;
};

/** Parses a Markdown string into an HTML string. Does not sanitize the result. */
const parseMarkdownToHtml = (
  markdown: string,
  options?: MarkedOptions
): string => marked.parse(markdown, { ...options, async: false });

/**
 * Markdown renders a Markdown string as HTML, using the `marked` parser and
 * sanitizing the result with DOMPurify before injecting it into the DOM.
 */
export const Markdown = forwardRef<HTMLDivElement, MarkdownProps>(
  (props, ref) => {
    const { children, markedOptions, className, ...other } = props;
    // Defensive: MarkdownProps already excludes this, but strip it at runtime
    // too, since passing it alongside the output div's own JSX child throws.
    delete (other as Record<string, unknown>).dangerouslySetInnerHTML;
    const { isBrowser } = useSsr();

    const classedHtml = useMemo(
      () =>
        applyMarkdownClasses(parseMarkdownToHtml(children, markedOptions), s),
      [children, markedOptions]
    );

    // DOMPurify requires a DOM; nothing is rendered until mounted in the browser.
    const sanitizedHtml = isBrowser ? DOMPurify.sanitize(classedHtml) : '';

    return (
      <div ref={ref} className={clsx(s.markdown, className)} {...other}>
        <div
          className={s.markdownOutput}
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
      </div>
    );
  }
);

Markdown.displayName = 'Markdown';
