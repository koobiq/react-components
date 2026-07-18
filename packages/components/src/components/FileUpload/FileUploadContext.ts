'use client';

import { createContext, useContext } from 'react';
import type { RefObject } from 'react';

import type { Key } from '@koobiq/react-core';

import type {
  FileUploadValidate,
  FileUploadMessages,
  FileUploadPropSize,
  FileUploadPropAllowed,
} from './types';

export type FileUploadContextValue = {
  allowsMultiple: boolean;
  accept?: string[];
  maxFileSize?: number;
  validate?: FileUploadValidate;
  allowed: FileUploadPropAllowed;
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
  /** Register validation errors produced by a rendered item. */
  registerItemValidation: (id: Key, name: string, errors: string[]) => void;
  /** Remove validation errors when an item is no longer rendered. */
  unregisterItemValidation: (id: Key) => void;
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
  rootRef: RefObject<HTMLDivElement | null>;
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
