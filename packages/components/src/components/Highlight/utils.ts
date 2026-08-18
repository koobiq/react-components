import { isString } from '@koobiq/react-core';

/** A chunk of text produced by splitting a string on a search query. */
export type HighlightPart = {
  text: string;
  isMatch: boolean;
};

const REGEXP_SPECIAL_CHARS = /[.*+?^${}()|[\]\\]/g;

/** Escapes characters that have a special meaning in a regular expression. */
export const escapeRegExp = (value: string): string =>
  value ? value.replace(REGEXP_SPECIAL_CHARS, '\\$&') : value;

/**
 * Splits `text` into alternating plain and matched chunks.
 * Matching is case-insensitive and covers every occurrence of `query`.
 */
export const splitByQuery = (
  text: unknown,
  query: unknown
): HighlightPart[] => {
  if (!isString(text)) return [];

  if (!query || !isString(query)) return [{ text, isMatch: false }];

  // The capture group makes `split` interleave plain and matched chunks,
  // so odd indices are the matches. Empty chunks are dropped afterwards
  // to keep the index parity intact.
  return text
    .split(new RegExp(`(${escapeRegExp(query)})`, 'gi'))
    .map((part, index) => ({ text: part, isMatch: index % 2 === 1 }))
    .filter((part) => part.text !== '');
};
