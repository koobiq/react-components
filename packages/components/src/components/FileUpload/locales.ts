import type { FileUploadLocaleConfig } from './types';

/** Bundled `en-US` caption configuration. */
export const enUSFileUploadConfig: FileUploadLocaleConfig = {
  single: {
    captionText: 'Drag file here or {{ browseLink }}',
    captionTextOnlyFolder: 'Drag here or {{ browseLinkFolder }}',
    captionTextWithFolder:
      'Drag here or {{ browseLink }} or {{ browseLinkFolderMixed }}',
    browseLink: 'choose',
    browseLinkFolder: 'choose folder',
    browseLinkFolderMixed: 'folder',
  },
  multiple: {
    captionText: 'or {{ browseLink }}',
    captionTextOnlyFolder: 'or {{ browseLinkFolder }}',
    captionTextWithFolder: 'or {{ browseLink }} or {{ browseLinkFolderMixed }}',
    captionTextWhenSelected: 'Drag more or {{ browseLink }}',
    captionTextForCompactSize: 'Drag files or {{ browseLink }}',
    browseLink: 'choose files',
    browseLinkFolder: 'choose folder',
    browseLinkFolderMixed: 'folder',
    title: 'Drag here',
  },
};

/** Bundled `ru-RU` caption configuration. */
export const ruRUFileUploadConfig: FileUploadLocaleConfig = {
  single: {
    captionText: 'Перетащите сюда или {{ browseLink }}',
    captionTextOnlyFolder: 'Перетащите сюда или {{ browseLinkFolder }}',
    captionTextWithFolder:
      'Перетащите сюда или {{ browseLink }} или {{ browseLinkFolderMixed }}',
    browseLink: 'выберите файл',
    browseLinkFolder: 'выберите папку',
    browseLinkFolderMixed: 'папку',
  },
  multiple: {
    captionText: 'или {{ browseLink }}',
    captionTextOnlyFolder: 'или {{ browseLinkFolder }}',
    captionTextWithFolder:
      'или {{ browseLink }} или {{ browseLinkFolderMixed }}',
    captionTextWhenSelected: 'Перетащите еще или {{ browseLink }}',
    captionTextForCompactSize: 'Перетащите сюда или {{ browseLink }}',
    browseLink: 'выберите файлы',
    browseLinkFolder: 'выберите папку',
    browseLinkFolderMixed: 'папку',
    title: 'Перетащите сюда',
  },
};

/** Bundled `pt-BR` caption configuration. */
export const ptBRFileUploadConfig: FileUploadLocaleConfig = {
  single: {
    captionText: 'Arrastar o arquivo aqui ou {{ browseLink }}',
    captionTextOnlyFolder: 'Arrastar o arquivo aqui ou {{ browseLinkFolder }}',
    captionTextWithFolder:
      'Arrastar o arquivo aqui ou {{ browseLink }} ou {{ browseLinkFolderMixed }}',
    browseLink: 'escolher',
    browseLinkFolder: 'pasta',
    browseLinkFolderMixed: 'pasta',
  },
  multiple: {
    captionText: 'Arrastar aqui ou {{ browseLink }}',
    captionTextOnlyFolder: 'Arrastar aqui ou {{ browseLinkFolder }}',
    captionTextWithFolder:
      'Arrastar aqui ou {{ browseLink }} ou {{ browseLinkFolderMixed }}',
    captionTextWhenSelected: 'Arrastar mais arquivos aqui ou {{ browseLink }}',
    captionTextForCompactSize: 'Arrastar arquivos ou {{ browseLink }}',
    browseLink: 'escolher',
    browseLinkFolder: 'pasta',
    browseLinkFolderMixed: 'pasta',
    title: 'Carregar arquivos',
  },
};

/** Bundled `es-LA` caption configuration. */
export const esLAFileUploadConfig: FileUploadLocaleConfig = {
  single: {
    captionText: 'Arrastre el archivo aquí o {{ browseLink }}',
    captionTextOnlyFolder: 'Arrastre el archivo aquí o {{ browseLinkFolder }}',
    captionTextWithFolder:
      'Arrastre el archivo aquí o {{ browseLink }} o {{ browseLinkFolderMixed }}',
    browseLink: 'elija',
    browseLinkFolder: 'carpeta',
    browseLinkFolderMixed: 'carpeta',
  },
  multiple: {
    captionText: 'Arrastre aquí o {{ browseLink }}',
    captionTextOnlyFolder: 'Arrastre aquí o {{ browseLinkFolder }}',
    captionTextWithFolder:
      'Arrastre aquí o {{ browseLink }} o {{ browseLinkFolderMixed }}',
    captionTextWhenSelected: 'Arrastre más archivos aquí o {{ browseLink }}',
    captionTextForCompactSize: 'Arrastre archivos o {{ browseLink }}',
    browseLink: 'elija',
    browseLinkFolder: 'carpeta',
    browseLinkFolderMixed: 'carpeta',
    title: 'Cargue los archivos',
  },
};

/** Bundled `tk-TM` caption configuration. */
export const tkTMFileUploadConfig: FileUploadLocaleConfig = {
  single: {
    captionText: 'Faýly geçiriň ýa-da {{ browseLink }}',
    captionTextOnlyFolder: 'Faýly geçiriň ýa-da {{ browseLinkFolder }}',
    captionTextWithFolder:
      'Faýly geçiriň ýa-da {{ browseLink }} ýa-da {{ browseLinkFolderMixed }}',
    browseLink: 'saýlaň',
    browseLinkFolder: 'bukja',
    browseLinkFolderMixed: 'bukja',
  },
  multiple: {
    captionText: 'Şu ýere geçiriň ýa-da {{ browseLink }}',
    captionTextOnlyFolder: 'Şu ýere geçiriň ýa-da {{ browseLinkFolder }}',
    captionTextWithFolder:
      'Şu ýere geçiriň ýa-da {{ browseLink }} ýa-da {{ browseLinkFolderMixed }}',
    captionTextWhenSelected: 'Ýene geçiriň ýa-da {{ browseLink }}',
    captionTextForCompactSize: 'Faýllary geçiriň ýa-da {{ browseLink }}',
    browseLink: 'saýlaň',
    browseLinkFolder: 'bukja',
    browseLinkFolderMixed: 'bukja',
    title: 'Faýl ýükläň',
  },
};

/** Default configuration used when no locale matches. */
export const DEFAULT_FILE_UPLOAD_CONFIG = enUSFileUploadConfig;

/** All bundled locale configurations, keyed by locale. */
export const fileUploadIntl: Record<string, FileUploadLocaleConfig> = {
  'en-US': enUSFileUploadConfig,
  'ru-RU': ruRUFileUploadConfig,
  'pt-BR': ptBRFileUploadConfig,
  'es-LA': esLAFileUploadConfig,
  'tk-TM': tkTMFileUploadConfig,
};
