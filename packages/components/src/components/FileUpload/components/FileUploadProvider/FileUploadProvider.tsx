'use client';

import { useMemo } from 'react';
import type { ReactNode } from 'react';

import { FileUploadContext } from '../../FileUploadContext';
import type { FileUploadContextValue } from '../../FileUploadContext';

export interface FileUploadProviderProps extends FileUploadContextValue {
  /** Descendants that consume the upload context. */
  children: ReactNode;
}

/**
 * Publishes upload configuration to descendant primitives. Non-nil values take
 * precedence over a descendant's own local props.
 */
export const FileUploadProvider = (props: FileUploadProviderProps) => {
  const { children, id, isDisabled, multiple, accept, directory } = props;

  const value = useMemo<FileUploadContextValue>(
    () => ({ id, isDisabled, multiple, accept, directory }),
    [id, isDisabled, multiple, accept, directory]
  );

  return (
    <FileUploadContext.Provider value={value}>
      {children}
    </FileUploadContext.Provider>
  );
};

FileUploadProvider.displayName = 'FileUploadProvider';
