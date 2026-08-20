'use client';

import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

import type { HLJSApi, LanguageFn } from 'highlight.js';

/** `highlight.js` loading configuration for `CodeBlock`. */
export type CodeBlockHighlightConfig = Partial<{
  /** Lazy loader for the highlight.js core (no bundled languages). When omitted, the full bundle is loaded. */
  core: () => Promise<{ default: HLJSApi }>;
  /** Map of language name to a lazy loader for that language's `LanguageFn`. */
  languages: Record<string, () => Promise<{ default: LanguageFn }>>;
  /** Language used when a file language is missing or unsupported. */
  fallbackLanguage: string;
}>;

const CodeBlockHighlightConfigContext =
  createContext<CodeBlockHighlightConfig | null>(null);

// A stable reference so `useCodeBlockHighlightConfig` doesn't hand back a new object identity on every
// call when no provider is present — `useHighlightedCode` keys its load cache off that identity.
const EMPTY_CONFIG: CodeBlockHighlightConfig = {};

export type CodeBlockHighlightConfigProviderProps = {
  /** The `highlight.js` loading configuration applied to every `CodeBlock` inside. */
  config: CodeBlockHighlightConfig;
  children?: ReactNode;
};

/**
 * Configures how `CodeBlock` loads `highlight.js`.
 *
 * By default, `CodeBlock` lazily loads the full `highlight.js` bundle with all languages (~1 MB).
 * To reduce bundle size, wrap the app (or a part of it) with this provider and specify only the languages you need.
 * @example
 * ```tsx
 * <CodeBlockHighlightConfigProvider
 *   config={{
 *     core: () => import('highlight.js/lib/core'),
 *     languages: {
 *       typescript: () => import('highlight.js/lib/languages/typescript'),
 *       css: () => import('highlight.js/lib/languages/css'),
 *       html: () => import('highlight.js/lib/languages/xml')
 *     },
 *     fallbackLanguage: 'plaintext'
 *   }}
 * >
 *   <App />
 * </CodeBlockHighlightConfigProvider>
 * ```
 */
export function CodeBlockHighlightConfigProvider(
  props: CodeBlockHighlightConfigProviderProps
) {
  const { config, children } = props;

  return (
    <CodeBlockHighlightConfigContext.Provider value={config}>
      {children}
    </CodeBlockHighlightConfigContext.Provider>
  );
}

export function useCodeBlockHighlightConfig(): CodeBlockHighlightConfig {
  return useContext(CodeBlockHighlightConfigContext) ?? EMPTY_CONFIG;
}
