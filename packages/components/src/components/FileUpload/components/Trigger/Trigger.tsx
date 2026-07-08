'use client';

import { forwardRef } from 'react';

import { FileTrigger } from '@koobiq/react-primitives';

import { Link } from '../../../Link';
import { useFileUploadContext } from '../../FileUploadContext';
import type { FileUploadTriggerProps } from '../../types';
import { resolveBrowseText } from '../../utils';

/**
 * The browse link that opens the system file dialog. Built on React Aria's
 * `FileTrigger`; the ref points to the underlying hidden file input.
 */
export const FileUploadTrigger = forwardRef<
  HTMLInputElement,
  FileUploadTriggerProps
>((props, ref) => {
  const { children, className, style, 'data-testid': testId } = props;

  const {
    accept,
    allowed,
    isDisabled,
    addFiles,
    allowsMultiple,
    messages,
    setTriggerRef,
  } = useFileUploadContext();

  const label =
    children ?? resolveBrowseText(allowed, allowsMultiple, messages);

  return (
    <FileTrigger
      ref={ref}
      acceptedFileTypes={accept}
      allowsMultiple={allowsMultiple}
      acceptDirectory={allowed === 'folder'}
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
        {label}
      </Link>
    </FileTrigger>
  );
});

FileUploadTrigger.displayName = 'FileUpload.Trigger';
