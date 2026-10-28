/** A locale prepared for both `Intl` and the Koobiq formatter data. */
export type ResolvedLocale = {
  /** The tag to pass to `Intl`. */
  locale: string;
  /** The language to pick Koobiq data by. */
  language: string;
  /** Language and region only: the form of the Koobiq Angular locale ids. */
  id: string;
};

const FALLBACK_LOCALE = 'en-US';

/**
 * Resolves `locale` for the formatters, or the runtime default when it is not
 * given. Not part of the public API.
 */
export const resolveLocale = (locale?: string): ResolvedLocale => {
  const requested = new Intl.Locale(
    locale || new Intl.NumberFormat().resolvedOptions().locale
  );

  // For a locale it has no data for (e.g. `rue`), `Intl` silently uses the
  // system one, which would pair that locale's digits with English labels.
  const resolved = Intl.NumberFormat.supportedLocalesOf(requested.toString())
    .length
    ? requested
    : new Intl.Locale(FALLBACK_LOCALE);

  const { language, region } = resolved;

  return {
    locale: resolved.toString(),
    language,
    id: region ? `${language}-${region}` : language,
  };
};
