import type { ReactNode } from 'react';

import { I18nProvider } from '@react-aria/i18n';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { FileSizeFormatterConfig } from '../../utils/FileSizeFormatter';

import { useFileSizeFormatter } from './useFileSizeFormatter';

const withLocale = (locale: string) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return <I18nProvider locale={locale}>{children}</I18nProvider>;
  };

describe('useFileSizeFormatter', () => {
  it('formats using the current locale', () => {
    const { result } = renderHook(() => useFileSizeFormatter(), {
      wrapper: withLocale('ru-RU'),
    });

    expect(result.current.format(1500)).toBe('1,5 КБ');
  });

  it('applies the provided config', () => {
    const { result } = renderHook(
      () => useFileSizeFormatter({ defaultUnitSystem: 'IEC' }),
      { wrapper: withLocale('en-US') }
    );

    expect(result.current.format(1024)).toBe('1 KiB');
  });

  it('reuses the formatter across renders with an equal config', () => {
    const config: FileSizeFormatterConfig = { defaultPrecision: 1 };

    const { result, rerender } = renderHook(
      () => useFileSizeFormatter(config),
      { wrapper: withLocale('en-US') }
    );

    const first = result.current;

    rerender();

    expect(result.current).toBe(first);
  });
});
