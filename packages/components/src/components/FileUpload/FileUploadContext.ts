'use client';

import { createContext, useContext } from 'react';

/** Configuration published to descendant upload primitives. */
export interface FileUploadContextValue {
  /** Id applied to the underlying file input. */
  id?: string | null;
  /** Whether interaction is disabled. */
  isDisabled?: boolean | null;
  /** Whether multiple selection is allowed. */
  multiple?: boolean | null;
  /** Native-input `accept` specifiers (already joined). */
  accept?: string | null;
  /** Whether the input selects directories (`webkitdirectory`). */
  directory?: boolean | null;
}

export const FileUploadContext = createContext<FileUploadContextValue | null>(
  null
);

/** Reads the nearest {@link FileUploadContext}, if any. */
export const useFileUploadContext = (): FileUploadContextValue | null =>
  useContext(FileUploadContext);
