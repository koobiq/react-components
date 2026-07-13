'use client';

import type { Ref } from 'react';
import { cloneElement, forwardRef, isValidElement } from 'react';

import { mergeRefs } from '@koobiq/react-core';
import { FileTrigger } from '@koobiq/react-primitives';

import { Link } from '../../../Link';
import { useFileUploadContext } from '../../FileUploadContext';
import type { FileUploadTriggerProps } from '../../types';
import { resolveBrowseText } from '../../utils';

type CustomTriggerProps = {
  ref?: Ref<HTMLElement>;
  isDisabled?: boolean;
};

/**
 * Opens the system file dialog. Renders a browse link by default and accepts a
 * custom pressable child. The ref points to the underlying hidden file input.
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

  const label =
    children ??
    (acceptDirectory === undefined
      ? resolveBrowseText(allowed, allowsMultiple, messages)
      : isDirectory
        ? messages.browseFolder
        : allowsMultiple
          ? messages.browseFiles
          : messages.browseFile);

  const customTrigger = isValidElement<CustomTriggerProps>(children)
    ? cloneElement(children, {
        ref: mergeRefs(children.props.ref, setTriggerRef),
        isDisabled: children.props.isDisabled || isDisabled,
      })
    : null;

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
      {customTrigger ?? (
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
      )}
    </FileTrigger>
  );
});

FileUploadTrigger.displayName = 'FileUpload.Trigger';
