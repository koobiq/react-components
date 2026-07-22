import type { UsernameUserInfo } from './types';

const fieldMap: Record<string, keyof UsernameUserInfo> = {
  l: 'lastName',
  f: 'firstName',
  m: 'middleName',
};

/**
 * Maps format-string characters to `UsernameUserInfo` field names.
 * Used by `formatUsernameCustom`. Characters absent from the mapping
 * (or mapped to `undefined`) are emitted as literals.
 */
export type UsernameFormatMapping = Record<
  string,
  keyof UsernameUserInfo | undefined
>;

const defaultCustomMapping: UsernameFormatMapping = {
  F: 'firstName',
  f: 'firstName',
  M: 'middleName',
  m: 'middleName',
  L: 'lastName',
  l: 'lastName',
};

/**
 * Formats user profile data into a display name string using a format pattern.
 *
 * Format characters: `l` = lastName, `f` = firstName, `m` = middleName.
 * A letter followed by `.` produces an initial + period (e.g. `f.` → "M.").
 * Empty fields are silently skipped without leaving stray punctuation.
 * @example
 * formatUsername({ firstName: 'Maxwell', middleName: 'Alan', lastName: 'Root' }, 'lf.m.')
 * // → "Root M. A."
 */
export function formatUsername(
  userInfo: UsernameUserInfo | undefined,
  format = 'lf.m.'
): string {
  if (!userInfo) return '';

  const tokens: string[] = [];
  let i = 0;

  while (i < format.length) {
    const char = format[i];
    const fieldKey = fieldMap[char];

    if (fieldKey) {
      const value = userInfo[fieldKey]?.trim() ?? '';
      const takesInitial = format[i + 1] === '.';

      if (value) {
        tokens.push(takesInitial ? `${value[0].toUpperCase()}.` : value);
      }

      // consume the trailing '.' whether the field had a value
      if (takesInitial) i += 1;
    }

    // standalone '.' is only a separator marker — never emitted literally
    i += 1;
  }

  return tokens.join(' ');
}

/**
 * Formats user profile data into a display name string using a richer format pattern.
 *
 * - Uppercase letters (`L`, `F`, `M`) → full field value.
 * - Lowercase letters (`l`, `f`, `m`) → first character (initial) only.
 * - All other characters are emitted literally (spaces, dots, slashes, etc.).
 * - Empty fields are silently dropped; surrounding literal characters still emit.
 *
 * Default format `'L f. m.'` produces `"Root M. A."` for
 * `{ firstName: 'Maxwell', middleName: 'Alan', lastName: 'Root' }`.
 *
 * Pass a custom `mapping` to bind format keys to different `UsernameUserInfo` fields.
 * @example
 * formatUsernameCustom({ firstName: 'Maxwell', middleName: 'Alan', lastName: 'Root' }, 'L f. m.')
 * // → "Root M. A."
 */
export function formatUsernameCustom(
  userInfo: UsernameUserInfo | undefined,
  format = 'L f. m.',
  mapping: UsernameFormatMapping = defaultCustomMapping
): string {
  if (!userInfo) return '';

  let result = '';

  for (const char of format) {
    if (!(char in mapping)) {
      result += char;
      continue;
    }

    const fieldKey = mapping[char];

    if (!fieldKey) {
      result += char;
      continue;
    }

    const value = userInfo[fieldKey]?.trim() ?? '';

    if (value) {
      result += char === char.toLowerCase() ? value[0] : value;
    }
  }

  return result.trim();
}

export type BuildUsernameTextOptions = {
  /**
   * Formats the login segment.
   * @default (login) => login
   */
  formatLogin?: (login: string) => string;
  /**
   * Formats the site segment.
   * @default (site) => `(${site})`
   */
  formatSite?: (site: string) => string;
};

/**
 * Builds a plain-text string from a pre-formatted name plus optional login and site,
 * mirroring the text rendered by `Username`.
 *
 * Pass the result of `formatUsername` or `formatUsernameCustom` as `name`.
 * Use `formatLogin`/`formatSite` options to customise how those segments appear.
 * @example
 * const name = formatUsername(userInfo, 'lf.m.');
 * buildUsernameText({ name, login: userInfo.login, site: userInfo.site });
 * // → "Root M. A. mroot (corp)"
 * @example
 * // Strip parentheses from site (useful for search/filter comparisons)
 * buildUsernameText({ name, login, site }, { formatSite: (s) => s });
 * // → "Root M. A. mroot corp"
 */
export function buildUsernameText(
  data: { name: string; login?: string; site?: string },
  options?: BuildUsernameTextOptions
): string {
  const formatLogin = options?.formatLogin ?? ((login) => login);
  const formatSite = options?.formatSite ?? ((site) => `(${site})`);

  return [
    data.name,
    data.login && formatLogin(data.login),
    data.site && formatSite(data.site),
  ]
    .filter(Boolean)
    .join(' ');
}
