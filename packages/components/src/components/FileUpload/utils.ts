import { isFileDropItem } from '@koobiq/react-primitives';
import type { DropItem } from '@koobiq/react-primitives';

import type { FileUploadMessages, FileUploadPropAllowed } from './types';

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
