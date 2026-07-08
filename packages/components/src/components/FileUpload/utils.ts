import { isFileDropItem } from '@koobiq/react-primitives';
import type { DropItem } from '@koobiq/react-primitives';

import type {
  FileUploadItem,
  FileUploadMessages,
  FileUploadPropAllowed,
} from './types';

let uid = 0;

/** Wraps a native `File` into a `FileUploadItem` with a unique id. */
export const createFileUploadItem = (file: File): FileUploadItem => {
  uid += 1;

  return { id: `kbq-file-upload-${uid}`, file };
};

/** The name to display for an item (explicit override, then the file name). */
export const getItemName = (item: FileUploadItem): string =>
  item.name ?? item.file?.name ?? '';

/** The size in bytes to display for an item (override, then the file size). */
export const getItemSize = (item: FileUploadItem): number | undefined =>
  item.size ?? item.file?.size;

/** Extracts native files from React Aria drop items (non-file items ignored). */
export const readDroppedFiles = (items: DropItem[]): Promise<File[]> =>
  Promise.all(items.filter(isFileDropItem).map((item) => item.getFile()));

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
