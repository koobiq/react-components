'use client';

import { forwardRef } from 'react';

import { FileTrigger } from '@koobiq/react-primitives';

import { Link } from '../../../Link';
import { useFileUploadContext } from '../../FileUploadContext';
import type { FileUploadTriggerProps } from '../../types';
import { resolveBrowseText } from '../../utils';

/**
 * Opens the system file dialog. The ref points to the underlying hidden file
 * input.
 */
export const FileUploadTrigger = forwardRef<
  HTMLInputElement,
  FileUploadTriggerProps
>((props, ref) => {
  const {
    children,
    className,
    style,
    acceptDirectory,
    'data-testid': testId,
  } = props;

  const {
    accept,
    allowed,
    isDisabled,
    addFiles,
    allowsMultiple,
    messages,
    setTriggerRef,
  } = useFileUploadContext();

  const isDirectory = acceptDirectory ?? allowed === 'folder';

  let defaultContent = resolveBrowseText(allowed, allowsMultiple, messages);

  if (acceptDirectory !== undefined) {
    if (isDirectory) {
      defaultContent = messages.browseFolder;
    } else if (allowsMultiple) {
      defaultContent = messages.browseFiles;
    } else {
      defaultContent = messages.browseFile;
    }
  }

  const content = children ?? defaultContent;

  return (
    <FileTrigger
      ref={ref}
      acceptedFileTypes={accept}
      allowsMultiple={allowsMultiple || isDirectory}
      acceptDirectory={isDirectory}
      onSelect={(files) => {
        if (files) {
          addFiles(Array.from(files));
        }
      }}
    >
      <Link
        isPseudo
        style={style}
        ref={setTriggerRef}
        className={className}
        isDisabled={isDisabled}
        data-testid={testId}
      >
        {content}
      </Link>
    </FileTrigger>
  );
});

export const FileUploadTriggers = () => {
  const { allowed, messages } = useFileUploadContext();

  if (allowed !== 'mixed') return <FileUploadTrigger />;

  return (
    <>
      <FileUploadTrigger acceptDirectory={false} />
      {` ${messages.alternativeSeparator} `}
      <FileUploadTrigger acceptDirectory>
        {messages.browseFolderMixed}
      </FileUploadTrigger>
    </>
  );
};

FileUploadTrigger.displayName = 'FileUpload.Trigger';
