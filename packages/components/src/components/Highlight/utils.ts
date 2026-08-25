/** A chunk of text produced by splitting a string on a search query. */
export type HighlightPart = {
  text: string;
  isMatch: boolean;
};

const REGEXP_SPECIAL_CHAR = /[.*+?^${}()|[\]\\]/;
const COMBINING_MARK = /\p{M}/u;

/**
 * Builds a pattern that matches `query` against `text` regardless of diacritics
 * (e.g. query "e" matches "é"), so matching stays consistent with the
 * diacritic-insensitive `contains`/`startsWith` matchers `useFilter` provides
 * for filtering the same data.
 */
const buildMatchPattern = (query: string): string =>
  Array.from(query.normalize('NFD'))
    .filter((char) => !COMBINING_MARK.test(char))
    .map(
      (char) => `${REGEXP_SPECIAL_CHAR.test(char) ? `\\${char}` : char}\\p{M}*`
    )
    .join('');

/**
 * Splits `text` into alternating plain and matched chunks.
 * Matching is case- and diacritic-insensitive and covers every occurrence of `query`.
 */
export const splitByQuery = (
  text?: string,
  query?: string
): HighlightPart[] => {
  if (!text) return [];

  if (!query) return [{ text, isMatch: false }];

  const pattern = buildMatchPattern(query);

  if (!pattern) return [{ text, isMatch: false }];

  // The capture group makes `split` interleave plain and matched chunks,
  // so odd indices are the matches; `text` is NFD-normalized first so the
  // pattern's `\p{M}*` can absorb a matched letter's combining diacritics,
  // then each chunk is normalized back to NFC so the rendered text is
  // codepoint-identical to the original (composed) `text` prop.
  return text
    .normalize('NFD')
    .split(new RegExp(`(${pattern})`, 'giu'))
    .reduce<HighlightPart[]>((parts, chunk, index) => {
      if (chunk !== '') {
        parts.push({ text: chunk.normalize('NFC'), isMatch: index % 2 === 1 });
      }

      return parts;
    }, []);
};
