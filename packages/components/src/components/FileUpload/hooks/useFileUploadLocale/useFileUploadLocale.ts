'use client';

import { useLocale } from '@koobiq/react-core';

import { DEFAULT_FILE_UPLOAD_CONFIG, fileUploadIntl } from '../../locales';
import type {
  FileUploadAllowedType,
  FileUploadCaptionContext,
  MultipleFileUploadLocaleConfig,
  MultipleFileUploadSize,
  SingleFileUploadLocaleConfig,
} from '../../types';

const FILE_LINK_PLACEHOLDER = '{{ browseLink }}';
const FOLDER_LINK_PLACEHOLDER = '{{ browseLinkFolder }}';
const FOLDER_MIXED_PLACEHOLDER = '{{ browseLinkFolderMixed }}';

const before = (template: string, placeholder: string): string =>
  template.split(placeholder)[0] ?? '';

const buildCaptionContext = (
  allowed: FileUploadAllowedType,
  config: SingleFileUploadLocaleConfig,
  fileCaption: string
): FileUploadCaptionContext => {
  switch (allowed) {
    case 'mixed': {
      const [head = '', tail = ''] = config.captionTextWithFolder.split(
        FILE_LINK_PLACEHOLDER
      );

      return {
        captionText: head,
        browseLink: config.browseLink,
        captionTextSeparator: tail.split(FOLDER_MIXED_PLACEHOLDER)[0],
        browseLinkFolder: config.browseLinkFolderMixed,
      };
    }

    case 'folder':
      return {
        captionText: before(
          config.captionTextOnlyFolder,
          FOLDER_LINK_PLACEHOLDER
        ),
        browseLinkFolder: config.browseLinkFolder,
      };
    case 'file':
    default:
      return {
        captionText: before(fileCaption, FILE_LINK_PLACEHOLDER),
        browseLink: config.browseLink,
      };
  }
};

export interface UseSingleFileUploadLocaleParams {
  allowed: FileUploadAllowedType;
  localeConfig?: Partial<SingleFileUploadLocaleConfig>;
}

export interface UseSingleFileUploadLocaleReturn {
  locale: string;
  config: SingleFileUploadLocaleConfig;
  captionContext: FileUploadCaptionContext;
}

/** Resolves single-file caption config (override > locale > fallback) + caption pieces. */
export function useSingleFileUploadLocale(
  params: UseSingleFileUploadLocaleParams
): UseSingleFileUploadLocaleReturn {
  const { allowed, localeConfig } = params;
  const { locale } = useLocale();

  const base = fileUploadIntl[locale] ?? DEFAULT_FILE_UPLOAD_CONFIG;

  const config: SingleFileUploadLocaleConfig = {
    ...base.single,
    ...localeConfig,
  };

  const captionContext = buildCaptionContext(
    allowed,
    config,
    config.captionTextWithFolder
  );

  return { locale, config, captionContext };
}

export interface UseMultipleFileUploadLocaleParams {
  allowed: FileUploadAllowedType;
  size: MultipleFileUploadSize;
  hasFiles: boolean;
  localeConfig?: Partial<MultipleFileUploadLocaleConfig>;
}

export interface UseMultipleFileUploadLocaleReturn {
  locale: string;
  config: MultipleFileUploadLocaleConfig;
  captionContext: FileUploadCaptionContext;
  /** Caption text shown when the list already contains files. */
  whenSelectedText: string;
}

/** Resolves multiple-file caption config + caption pieces + the "when selected" text. */
export function useMultipleFileUploadLocale(
  params: UseMultipleFileUploadLocaleParams
): UseMultipleFileUploadLocaleReturn {
  const { allowed, size, localeConfig } = params;
  const { locale } = useLocale();

  const base = fileUploadIntl[locale] ?? DEFAULT_FILE_UPLOAD_CONFIG;

  const config: MultipleFileUploadLocaleConfig = {
    ...base.multiple,
    ...localeConfig,
  };

  const fileCaption =
    size === 'compact' ? config.captionTextForCompactSize : config.captionText;

  const captionContext = buildCaptionContext(allowed, config, fileCaption);

  const whenSelectedText = before(
    config.captionTextWhenSelected,
    FILE_LINK_PLACEHOLDER
  );

  return { locale, config, captionContext, whenSelectedText };
}
