import { useMemo } from 'react';

import { useLocale } from '@react-aria/i18n';

import { DecimalFormatter } from '../../utils/DecimalFormatter';
import type { DecimalFormatterConfig } from '../../utils/DecimalFormatter';

/**
 * Returns a memoized {@link DecimalFormatter} bound to the current locale.
 * The formatter is recreated only when the locale or `config` changes.
 * @example
 * const formatter = useDecimalFormatter();
 * formatter.format(12345.6789, '1.0-2'); // "12,345.68"
 */
export function useDecimalFormatter(
  config?: DecimalFormatterConfig
): DecimalFormatter {
  const { locale } = useLocale();

  // `config` is a plain data object, so a stable serialization keeps the
  // formatter memoized across renders that pass an equal inline literal.
  return useMemo(
    () => new DecimalFormatter(locale, config),
    [locale, JSON.stringify(config)]
  );
}
