'use client';

import { createContext, useContext } from 'react';
import type { RefObject } from 'react';

import type { Key } from '@koobiq/react-core';

import type {
  FileUploadMessages,
  FileUploadPropSize,
  FileUploadPropAllowed,
  FileUploadPropDirectoryMode,
} from './types';

export type FileUploadContextValue = {
  allowsMultiple: boolean;
  accept?: string[];
  allowed: FileUploadPropAllowed;
  directoryMode: FileUploadPropDirectoryMode;
  size: FileUploadPropSize;
  isDisabled: boolean;
  isDropTarget: boolean;
  /** Add the given native files. The consumer decides how they affect `items`. */
  addFiles: (files: File[]) => void;
  /** Request removing the item with the given id and restore focus after rerender. */
  removeItem: (id: Key) => void;
  /** The remove-button ref of an item, used to restore focus after removal. */
  getItemRef: (id: Key) => RefObject<HTMLButtonElement | null>;
  /** Register the browse-link element for focus restoration. */
  setTriggerRef: (element: HTMLElement | null) => void;
  /** Resolved localized strings. */
  messages: FileUploadMessages;
  /** Locale-aware file-size formatter. */
  formatSize: (bytes: number) => string;
};

export type FileUploadItemContextValue = {
  id: Key;
  nameText?: string;
  isDisabled: boolean;
  isInvalid: boolean;
};

export const FileUploadContext = createContext<FileUploadContextValue | null>(
  null
);

export const FileUploadItemContext =
  createContext<FileUploadItemContextValue | null>(null);

export const useFileUploadContext = (): FileUploadContextValue => {
  const context = useContext(FileUploadContext);

  if (context === null) {
    throw new Error(
      'FileUpload: compound components must be rendered inside a <FileUpload>.'
    );
  }

  return context;
};

export const useFileUploadItemContext = (): FileUploadItemContextValue => {
  const context = useContext(FileUploadItemContext);

  if (context === null) {
    throw new Error(
      'FileUpload: item parts must be rendered inside a <FileUpload.Item>.'
    );
  }

  return context;
};
