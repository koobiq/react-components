import type { ReactNode } from 'react';

import { I18nProvider } from '@react-aria/i18n';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { DecimalFormatterConfig } from '../../utils/DecimalFormatter';

import { useDecimalFormatter } from './useDecimalFormatter';

const withLocale = (locale: string) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return <I18nProvider locale={locale}>{children}</I18nProvider>;
  };

describe('useDecimalFormatter', () => {
  it('formats using the current locale', () => {
    const { result } = renderHook(() => useDecimalFormatter(), {
      wrapper: withLocale('ru-RU'),
    });

    expect(result.current.format(12345.6789)).toBe('12\u2009345,679');
    expect(result.current.formatRounded(15_300)).toBe('15 К');
  });

  it('applies the provided config', () => {
    const { result } = renderHook(
      () => useDecimalFormatter({ options: { maximumFractionDigits: 1 } }),
      { wrapper: withLocale('en-US') }
    );

    expect(result.current.format(1.25)).toBe('1.3');
  });

  it('reuses the formatter across renders with an equal config', () => {
    const config: DecimalFormatterConfig = { rounding: { thousand: 'k' } };

    const { result, rerender } = renderHook(() => useDecimalFormatter(config), {
      wrapper: withLocale('en-US'),
    });

    const first = result.current;

    rerender();

    expect(result.current).toBe(first);
  });
});
