import type { ReactNode } from 'react';

import { I18nProvider } from '@koobiq/react-core';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  useMultipleFileUploadLocale,
  useSingleFileUploadLocale,
} from './hooks/useFileUploadLocale';
import { fileUploadIntl } from './locales';

const LOCALES = ['en-US', 'ru-RU', 'pt-BR', 'es-LA', 'tk-TM'] as const;

const withLocale = (locale: string) => {
  const LocaleWrapper = ({ children }: { children: ReactNode }) => (
    <I18nProvider locale={locale}>{children}</I18nProvider>
  );

  LocaleWrapper.displayName = 'LocaleWrapper';

  return LocaleWrapper;
};

describe('FileUpload localization', () => {
  it('bundles all five locales', () => {
    expect(Object.keys(fileUploadIntl).sort()).toEqual([
      'en-US',
      'es-LA',
      'pt-BR',
      'ru-RU',
      'tk-TM',
    ]);
  });

  it.each(LOCALES)(
    'resolves the single-file caption for %s',
    (locale: (typeof LOCALES)[number]) => {
      const config = fileUploadIntl[locale];

      const { result } = renderHook(
        () => useSingleFileUploadLocale({ allowed: 'file' }),
        { wrapper: withLocale(locale) }
      );

      expect(result.current.locale).toBe(locale);

      expect(result.current.captionContext.captionText.length).toBeGreaterThan(
        0
      );

      expect(result.current.captionContext.browseLink).toBe(
        config?.single.browseLink
      );
    }
  );

  it('lets localeConfig override the resolved locale', () => {
    const { result } = renderHook(
      () =>
        useSingleFileUploadLocale({
          allowed: 'file',
          localeConfig: { browseLink: 'pick a file' },
        }),
      { wrapper: withLocale('en-US') }
    );

    expect(result.current.captionContext.browseLink).toBe('pick a file');
  });

  it('selects folder and mixed captions by allowed type', () => {
    const folder = renderHook(
      () => useSingleFileUploadLocale({ allowed: 'folder' }),
      { wrapper: withLocale('en-US') }
    );

    expect(folder.result.current.captionContext.browseLinkFolder).toBe(
      'choose folder'
    );

    expect(folder.result.current.captionContext.browseLink).toBeUndefined();

    const mixed = renderHook(
      () => useSingleFileUploadLocale({ allowed: 'mixed' }),
      { wrapper: withLocale('en-US') }
    );

    expect(mixed.result.current.captionContext.browseLink).toBe('choose');
    expect(mixed.result.current.captionContext.browseLinkFolder).toBe('folder');
  });

  it('multiple uses when-selected and compact captions', () => {
    const selected = renderHook(
      () =>
        useMultipleFileUploadLocale({
          allowed: 'file',
          size: 'default',
          hasFiles: true,
        }),
      { wrapper: withLocale('en-US') }
    );

    expect(selected.result.current.whenSelectedText).toContain('Drag more');

    const compact = renderHook(
      () =>
        useMultipleFileUploadLocale({
          allowed: 'file',
          size: 'compact',
          hasFiles: false,
        }),
      { wrapper: withLocale('en-US') }
    );

    expect(compact.result.current.captionContext.captionText).toContain(
      'Drag files'
    );
  });
});
