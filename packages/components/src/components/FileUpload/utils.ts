import type {
  FileUploadFile,
  FileUploadMessages,
  FileUploadPropAllowed,
} from './types';

type PrepareFilesOptions = {
  accept?: string[];
  allowed: FileUploadPropAllowed;
  allowsMultiple: boolean;
};

const normalizeRelativePath = (path: string): string =>
  path.replaceAll('\\', '/').replace(/^\/+/, '');

export const setFileRelativePath = (
  file: File,
  path: string
): FileUploadFile => {
  const relativePath = normalizeRelativePath(path);

  if ((file as Partial<FileUploadFile>).relativePath === relativePath) {
    return file as FileUploadFile;
  }

  Object.defineProperty(file, 'relativePath', {
    configurable: true,
    value: relativePath,
  });

  return file as FileUploadFile;
};

const getRootDirectory = (file: FileUploadFile): string | undefined =>
  file.relativePath.split('/').filter(Boolean)[0];

const isAcceptedFile = (file: File, accept?: string[]): boolean => {
  const values = accept
    ?.map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  if (!values?.length) return true;

  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();

  return values.some((value) => {
    if (value === '*/*') return true;
    if (value.startsWith('.')) return name.endsWith(value);
    if (value.endsWith('/*')) return type.startsWith(value.slice(0, -1));

    return type === value;
  });
};

/** Applies the same file constraints to picker and drop results. */
export const prepareFileUploadFiles = (
  files: File[],
  { accept, allowed, allowsMultiple }: PrepareFilesOptions
): FileUploadFile[] => {
  const normalized = files.map((file) =>
    setFileRelativePath(
      file,
      (file as Partial<FileUploadFile>).relativePath ??
        file.webkitRelativePath ??
        ''
    )
  );

  const filtered = normalized.filter((file) => {
    const isDirectoryFile = Boolean(getRootDirectory(file));

    const isAllowed =
      allowed === 'mixed' ||
      (allowed === 'folder' ? isDirectoryFile : !isDirectoryFile);

    return isAllowed && isAcceptedFile(file, accept);
  });

  if (allowsMultiple || filtered.length === 0) return filtered;

  const rootDirectory = getRootDirectory(filtered[0]);

  return rootDirectory
    ? filtered.filter((file) => getRootDirectory(file) === rootDirectory)
    : filtered.slice(0, 1);
};

/** The browse-link label for the current selection mode. */
export const resolveBrowseText = (
  allowed: FileUploadPropAllowed,
  allowsMultiple: boolean,
  messages: FileUploadMessages
): string => {
  if (allowed === 'folder') {
    return messages.browseFolder;
  }

  if (allowed === 'mixed') {
    return messages.browseFilesOrFolder;
  }

  return allowsMultiple ? messages.browseFiles : messages.browseFile;
};
