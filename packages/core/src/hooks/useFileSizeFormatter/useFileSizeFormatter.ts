import { useMemo } from 'react';

import { useLocale } from '@react-aria/i18n';

import {
  FileSizeFormatter,
  type FileSizeFormatterConfig,
} from '../../utils/FileSizeFormatter';

/**
 * Returns a memoized {@link FileSizeFormatter} bound to the current locale.
 * The formatter is recreated only when the locale or `config` changes.
 * @example
 * const formatter = useFileSizeFormatter();
 * formatter.format(1500); // "1.5 KB"
 */
export function useFileSizeFormatter(
  config?: FileSizeFormatterConfig
): FileSizeFormatter {
  const { locale } = useLocale();

  // `config` is a plain data object, so a stable serialization keeps the
  // formatter memoized across renders that pass an equal inline literal.
  return useMemo(
    () => new FileSizeFormatter(locale, config),
    [locale, JSON.stringify(config)]
  );
}
