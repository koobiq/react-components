'use client';

import { useEffect, useState } from 'react';

import { once } from '@koobiq/logger';
import type { HLJSApi } from 'highlight.js';

import { useCodeBlockHighlightConfig } from '../context';
import type { CodeBlockHighlightConfig } from '../context';
import type { CodeBlockFile } from '../types';
import { addLineNumbers } from '../utils/lineNumbers';

const FALLBACK_LANGUAGE = 'plaintext';

const hljsPromises = new WeakMap<CodeBlockHighlightConfig, Promise<HLJSApi>>();

async function loadHljs(config: CodeBlockHighlightConfig): Promise<HLJSApi> {
  const loadCore = config.core ?? (() => import('highlight.js'));
  const { default: instance } = await loadCore();

  if (config.languages) {
    await Promise.all(
      Object.entries(config.languages).map(async ([name, loadLanguage]) => {
        const { default: language } = await loadLanguage();

        instance.registerLanguage(name, language);
      })
    );
  }

  return instance;
}

/**
 * Resolves the shared `highlight.js` instance for the app.
 *
 * Cached at module scope so every `CodeBlock` on the page reuses the same load, keyed by the
 * `CodeBlockHighlightConfig` reference — pass a stable (e.g. module-level or memoized) `highlightConfig` to
 * `CodeBlockProvider` to avoid redundant reloads.
 */
function getHljsInstance(config: CodeBlockHighlightConfig): Promise<HLJSApi> {
  const cachedPromise = hljsPromises.get(config);

  if (cachedPromise) return cachedPromise;

  const promise = loadHljs(config).catch((error: unknown) => {
    // A transient chunk/network failure should be retryable by a later mount.
    hljsPromises.delete(config);

    throw error;
  });

  hljsPromises.set(config, promise);

  return promise;
}

export type UseHighlightedCodeOptions = {
  /** Whether to wrap the output in a line-numbered table. */
  hasLineNumbers?: boolean;
  /** The starting line number. */
  startFrom?: number;
};

export type UseHighlightedCodeResult = {
  /** Highlighted HTML, ready for `dangerouslySetInnerHTML`. Empty while `pending`. */
  html: string;
  /** Whether `highlight.js` is still loading. */
  pending: boolean;
  /** Whether loading or highlighting failed. */
  failed: boolean;
  /** The language `highlight.js` actually used (may differ from `file.language` if unsupported). */
  language: string;
};

type HighlightedCodeState = UseHighlightedCodeResult & {
  config: CodeBlockHighlightConfig;
  content: string;
  fileLanguage: string | undefined;
  hasLineNumbers: boolean;
  startFrom: number;
};

function escapeHTML(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

/**
 * Loads `highlight.js` (honoring `CodeBlockProvider`) and highlights `file`.
 *
 * `highlight.js` escapes the raw source text before wrapping it in `<span>` tokens, so the returned
 * `html` is safe to render with `dangerouslySetInnerHTML` — the same trust model other React syntax
 * highlighters rely on.
 */
export function useHighlightedCode(
  file: CodeBlockFile,
  options: UseHighlightedCodeOptions = {}
): UseHighlightedCodeResult {
  const { hasLineNumbers = false, startFrom = 1 } = options;
  const config = useCodeBlockHighlightConfig();
  const fallbackLanguage = config.fallbackLanguage ?? FALLBACK_LANGUAGE;

  const [result, setResult] = useState<HighlightedCodeState>({
    html: '',
    pending: true,
    failed: false,
    language: file.language ?? fallbackLanguage,
    config,
    content: file.content,
    fileLanguage: file.language,
    hasLineNumbers,
    startFrom,
  });

  const isCurrentResult =
    result.config === config &&
    result.content === file.content &&
    result.fileLanguage === file.language &&
    result.hasLineNumbers === hasLineNumbers &&
    result.startFrom === startFrom;

  useEffect(() => {
    let cancelled = false;

    // The inputs `isCurrentResult` compares the stored result against.
    const inputs = {
      config,
      content: file.content,
      fileLanguage: file.language,
      hasLineNumbers,
      startFrom,
    };

    getHljsInstance(config)
      .then((hljs) => {
        if (cancelled) return;

        let { language } = file;

        if (!language || !hljs.getLanguage(language)) {
          if (process.env.NODE_ENV !== 'production') {
            once.warn(
              language
                ? `[CodeBlock] Unsupported file language: "${language}". Fall back to "${fallbackLanguage}".`
                : `[CodeBlock] Missing file language. Fall back to "${fallbackLanguage}".`,
              file
            );
          }

          language = fallbackLanguage;
        }

        let value: string;
        let resolvedLanguage = language;

        if (hljs.getLanguage(language)) {
          const highlighted = hljs.highlight(file.content, { language });

          value = highlighted.value;
          resolvedLanguage = highlighted.language ?? language;

          if (process.env.NODE_ENV !== 'production' && highlighted.illegal) {
            once.warn(
              '[CodeBlock] File content contains illegal characters.',
              file
            );
          }

          if (
            process.env.NODE_ENV !== 'production' &&
            highlighted.relevance === 0
          ) {
            once.warn(
              '[CodeBlock] File content does not match the specified programming language.',
              file
            );
          }
        } else {
          value = escapeHTML(file.content);
        }

        const html = hasLineNumbers
          ? addLineNumbers(value, { startFrom })
          : value;

        setResult({
          ...inputs,
          html,
          pending: false,
          failed: false,
          language: resolvedLanguage,
        });
      })
      .catch((error: unknown) => {
        if (cancelled) return;

        if (process.env.NODE_ENV !== 'production') {
          once.warn('[CodeBlock] Failed to highlight the file.', error);
        }

        setResult({
          ...inputs,
          html: '',
          pending: false,
          failed: true,
          language: file.language ?? fallbackLanguage,
        });
      });

    return () => {
      cancelled = true;
    };
    // `file.content`/`file.language` (not `file`) so a fresh `file` object with the same values
    // (e.g. an inline object literal from the caller) doesn't re-trigger highlighting.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    config,
    fallbackLanguage,
    file.content,
    file.language,
    hasLineNumbers,
    startFrom,
  ]);

  if (!isCurrentResult) {
    return {
      html: '',
      pending: true,
      failed: false,
      language: file.language ?? fallbackLanguage,
    };
  }

  return result;
}
