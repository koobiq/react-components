'use client';

import { createContext, useContext } from 'react';

import type { Key } from '@koobiq/react-core';

import type {
  FileUploadItem,
  FileUploadMessages,
  FileUploadPropSize,
  FileUploadPropAllowed,
  FileUploadPropDirectoryMode,
} from './types';

export type FileUploadContextValue = {
  /** The current list of selected files. */
  items: FileUploadItem[];
  allowsMultiple: boolean;
  accept?: string[];
  allowed: FileUploadPropAllowed;
  directoryMode: FileUploadPropDirectoryMode;
  size: FileUploadPropSize;
  showFileSize: boolean;
  isDisabled: boolean;
  /** Whether a drag is currently over the drop zone. */
  isDropTarget: boolean;
  /** Wrap the given native files into items and add them to the list. */
  addFiles: (files: File[]) => void;
  /** Remove the item with the given id and restore focus. */
  removeItem: (id: Key) => void;
  /** Register the remove-button element of an item for focus restoration. */
  registerItemRef: (id: Key, element: HTMLElement | null) => void;
  /** Register the browse-link element for focus restoration. */
  setTriggerRef: (element: HTMLElement | null) => void;
  /** Resolved localized strings. */
  messages: FileUploadMessages;
  /** Locale-aware file-size formatter. */
  formatSize: (bytes: number) => string;
};

export const FileUploadContext = createContext<FileUploadContextValue | null>(
  null
);

export const useFileUploadContext = (): FileUploadContextValue => {
  const context = useContext(FileUploadContext);

  if (context === null) {
    throw new Error(
      'FileUpload: compound components must be rendered inside a <FileUpload>.'
    );
  }

  return context;
};
