'use client';

import type { Ref } from 'react';

import { clsx } from '@koobiq/react-core';
import { IconChevronDown16, IconChevronUp16 } from '@koobiq/react-icons';

import { utilClasses } from '../../../styles/utility';
import { Button } from '../../Button';
import s from '../CodeBlock.module.css';

export type CodeBlockCodeProps = {
  preRef: Ref<HTMLPreElement>;
  /** Highlighted markup, rendered when `isHighlighted` is set. */
  html: string;
  /** The language `highlight.js` used for `html`. */
  language: string;
  /** Raw source, rendered as plain text until the content is highlighted. */
  source: string;
  /** Whether `html` is ready to be rendered instead of `source`. */
  isHighlighted: boolean;
  /** Whether the content is clipped by `maxHeight` and can be expanded. */
  canViewAll: boolean;
  viewAll: boolean;
  onViewAllToggle: () => void;
  viewAllText: string;
  viewLessText: string;
};

export function CodeBlockCode(props: CodeBlockCodeProps) {
  const {
    preRef,
    html,
    language,
    source,
    isHighlighted,
    canViewAll,
    viewAll,
    onViewAllToggle,
    viewAllText,
    viewLessText,
  } = props;

  const codeClassName = clsx(
    'hljs',
    s.code,
    utilClasses.typography['mono-codeblock']
  );

  return (
    <>
      <pre ref={preRef} className={s.pre}>
        {/* Separate branches: `dangerouslySetInnerHTML` and children may not sit on one element. */}
        {isHighlighted ? (
          <code
            className={codeClassName}
            data-language={language}
            // `highlight.js` escapes the raw source before wrapping tokens in spans — see useHighlightedCode.
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <code className={codeClassName}>{source}</code>
        )}
      </pre>

      {canViewAll && (
        <div
          className={s.viewAll}
          data-state={viewAll ? 'expanded' : 'collapsed'}
        >
          <div className={s.viewAllWrapper}>
            <Button
              variant="theme-transparent"
              startIcon={viewAll ? <IconChevronUp16 /> : <IconChevronDown16 />}
              onPress={onViewAllToggle}
            >
              {viewAll ? viewLessText : viewAllText}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
