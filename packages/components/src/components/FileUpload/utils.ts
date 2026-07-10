import { isFileDropItem, isDirectoryDropItem } from '@koobiq/react-primitives';
import type { DropItem, DirectoryDropItem } from '@koobiq/react-primitives';

import type { FileUploadMessages, FileUploadPropAllowed } from './types';

/** Recursively collects native files from a dropped directory (deep). */
const readDroppedDirectory = async (
  directory: DirectoryDropItem
): Promise<File[]> => {
  const files: File[] = [];

  for await (const entry of directory.getEntries()) {
    if (isFileDropItem(entry)) {
      files.push(await entry.getFile());
    } else if (isDirectoryDropItem(entry)) {
      files.push(...(await readDroppedDirectory(entry)));
    }
  }

  return files;
};

/**
 * Extracts native files from React Aria drop items. Dropped folders are
 * expanded into their files recursively; non-file items are ignored.
 */
export const readDroppedFiles = async (items: DropItem[]): Promise<File[]> => {
  const groups = await Promise.all(
    items.map((item) => {
      if (isFileDropItem(item)) {
        return item.getFile().then((file) => [file]);
      }

      if (isDirectoryDropItem(item)) {
        return readDroppedDirectory(item);
      }

      return Promise.resolve<File[]>([]);
    })
  );

  return groups.flat();
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
