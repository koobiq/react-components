import type { UsernameUserInfo } from './types';

/** Punctuation `Username`'s built-in hint uses to wrap `userInfo.site`. */
export const usernameHintAffixes = { prefix: ' (', suffix: ')' } as const;

const legacyMapping: Record<string, keyof UsernameUserInfo> = {
  l: 'lastName',
  f: 'firstName',
  m: 'middleName',
};

/**
 * Maps format-string characters to `UsernameUserInfo` field names.
 * Characters absent from the mapping (or mapped to `undefined`) are
 * handled per `literalPassthrough`.
 */
export type UsernameFormatMapping = Record<
  string,
  keyof UsernameUserInfo | undefined
>;

export type UsernameFormatOptions = {
  /**
   * Field mapping used to resolve format characters.
   * @default { l: 'lastName', f: 'firstName', m: 'middleName' }
   */
  mapping?: UsernameFormatMapping;
  /**
   * Emit characters absent from `mapping` literally instead of dropping them.
   * @default false
   */
  literalPassthrough?: boolean;
  /**
   * Full-vs-initial is decided by the letter's own case rather than a trailing `.`.
   * @default false
   */
  caseDeterminesForm?: boolean;
  /**
   * Uppercase the first letter of a rendered initial.
   * @default true
   */
  uppercaseInitial?: boolean;
  /**
   * `'space'` joins non-empty tokens with a single space (legacy behavior);
   * `'concat'` preserves literal characters as written in `format`.
   * @default 'space'
   */
  join?: 'concat' | 'space';
};

/**
 * Formats user profile data into a display name string using a format pattern.
 *
 * By default, format characters `l` = lastName, `f` = firstName, `m` = middleName.
 * A letter followed by `.` produces an initial + period (e.g. `f.` → "M.").
 * Empty fields are silently skipped without leaving stray punctuation.
 * This default behavior is relied on by existing callers and must not change.
 *
 * `options` exposes the underlying parser's knobs so callers can compose a
 * different format style without a separate function. For example, to get
 * a parser where uppercase letters emit the full field value, lowercase
 * letters emit just the initial, and any other character (spaces, dots,
 * slashes, …) is emitted literally:
 * @example
 * formatUsername({ firstName: 'Maxwell', middleName: 'Alan', lastName: 'Root' }, 'lf.m.')
 * // → "Root M. A."
 * @example
 * formatUsername({ firstName: 'Maxwell', lastName: 'Root' }, 'F L', {
 *   mapping: { F: 'firstName', f: 'firstName', L: 'lastName', l: 'lastName' },
 *   literalPassthrough: true,
 *   caseDeterminesForm: true,
 *   uppercaseInitial: false,
 *   join: 'concat',
 * })
 * // → "Maxwell Root"
 */
export function formatUsername(
  userInfo: UsernameUserInfo | undefined,
  format = 'lf.m.',
  options?: UsernameFormatOptions
): string {
  if (!userInfo) return '';

  const {
    mapping = legacyMapping,
    literalPassthrough = false,
    caseDeterminesForm = false,
    uppercaseInitial = true,
    join = 'space',
  } = options ?? {};

  const tokens: string[] = [];
  let literal = '';
  let i = 0;

  const flushLiteral = () => {
    if (literal) {
      tokens.push(literal);
      literal = '';
    }
  };

  while (i < format.length) {
    const char = format[i];
    const fieldKey = mapping[char];

    if (!fieldKey) {
      if (literalPassthrough) literal += char;
      i += 1;
      continue;
    }

    const isInitial = caseDeterminesForm
      ? char === char.toLowerCase()
      : format[i + 1] === '.';

    const value = userInfo[fieldKey]?.trim() ?? '';

    if (value) {
      flushLiteral();
      const initial = uppercaseInitial ? value[0].toUpperCase() : value[0];

      tokens.push(
        isInitial ? `${initial}${caseDeterminesForm ? '' : '.'}` : value
      );
    }

    // legacy mode consumes the trailing '.' marker whether or not the field had a value
    if (!caseDeterminesForm && isInitial) i += 1;
    i += 1;
  }

  flushLiteral();

  return join === 'space' ? tokens.join(' ') : tokens.join('').trim();
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
 * Returns the same user information that `Username` displays, but as a plain string.
 * Useful for `aria-label` values and search/filter logic.
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
