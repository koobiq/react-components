import type { FileUploadMessages, FileUploadPropAllowed } from './types';

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
