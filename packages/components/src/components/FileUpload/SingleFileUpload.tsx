'use client';

import { forwardRef, useId, useImperativeHandle, useRef } from 'react';
import type { ChangeEvent } from 'react';

import { deprecate } from '@koobiq/logger';
import {
  clsx,
  mergeProps,
  useControlledState,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';
import { IconArrowUpFromBracket16 } from '@koobiq/react-icons';

import { FileUploadCaption } from './components/FileUploadCaption';
import { FileUploadItem } from './components/FileUploadItem';
import { FullScreenDropzone } from './components/FullScreenDropzone';
import { FOCUS_RETURN_DELAY } from './constants';
import s from './FileUpload.module.css';
import { useFileUploadContext } from './FileUploadContext';
import { useFileDrop } from './hooks/useFileDrop';
import { useSingleFileUploadLocale } from './hooks/useFileUploadLocale';
import { useFileUploadState } from './hooks/useFileUploadState';
import intlMessages from './intl.json';
import sSingle from './SingleFileUpload.module.css';
import type { FileItem, FileWithPath, SingleFileUploadProps } from './types';
import { formatDataSize, mapToFileItem } from './utils';

/**
 * SingleFileUpload lets a user select or drop a single file. Selection replaces
 * the previous file; removal clears the value. Validation is external — `accept`
 * is a browse hint only and is not enforced on drop.
 */
export const SingleFileUpload = forwardRef<
  HTMLDivElement,
  SingleFileUploadProps
>((props, ref) => {
  const {
    value: valueProp,
    defaultValue = null,
    onChange,
    onFilesAdded,
    onFileRemoved,
    onBlur,
    accept,
    allowed = 'file',
    isDisabled: isDisabledProp,
    disabled,
    isInvalid: isInvalidProp,
    shouldShowError,
    showFileSize = true,
    progressMode = 'determinate',
    inputId: inputIdProp,
    localeConfig,
    icon,
    errorMessage,
    caption,
    className,
    slotProps,
    fullScreenDropzone,
    dropTargetRef,
    ...other
  } = props;

  if (process.env.NODE_ENV !== 'production' && 'disabled' in props) {
    deprecate(
      'SingleFileUpload: the "disabled" prop is deprecated. Use "isDisabled" prop to replace it.'
    );
  }

  const context = useFileUploadContext();
  const isDisabled = isDisabledProp ?? disabled ?? context?.isDisabled ?? false;
  const isInvalid = isInvalidProp ?? false;
  const generatedId = useId();
  const inputId = inputIdProp ?? context?.id ?? generatedId;

  const t = useLocalizedStringFormatter(intlMessages);

  const [value, setValue] = useControlledState<FileItem | null>(
    valueProp,
    defaultValue,
    onChange
  );

  const { errorState, markTouched, markDirty } = useFileUploadState({
    isInvalid,
    shouldShowError,
  });

  const invalid = !!value?.hasError || errorState;

  const { locale, captionContext } = useSingleFileUploadLocale({
    allowed,
    localeConfig,
  });

  const browseInputRef = useRef<HTMLInputElement>(null);
  const acceptAttr = accept?.length ? accept.join(',') : undefined;
  const fullScreenActive = !!fullScreenDropzone;

  const selectFile = (file: File) => {
    const item = mapToFileItem(file);

    setValue(item);
    onFilesAdded?.(item);
    markDirty();
  };

  const handleSelectViaClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (isDisabled) {
      return;
    }

    const file = event.target.files?.[0];

    if (file) {
      selectFile(file);
    }

    markTouched();
  };

  const handleDrop = (files: FileWithPath[]) => {
    if (isDisabled) {
      return;
    }

    const [first] = files;

    if (first) {
      selectFile(first);
    }

    // Mark touched after a drop even when nothing was accepted.
    markTouched();
  };

  const handleRemove = () => {
    if (isDisabled) {
      return;
    }

    const removed = value;

    setValue(null);

    if (removed) {
      onFileRemoved?.(removed);
    }

    markTouched();

    // Return focus to the input once the empty state (with its input) re-renders.
    setTimeout(() => browseInputRef.current?.focus(), FOCUS_RETURN_DELAY);
  };

  const { dropRef } = useFileDrop<HTMLDivElement>({
    disabled: isDisabled || fullScreenActive,
    onFilesDropped: handleDrop,
  });

  useImperativeHandle(dropTargetRef, () => ({ addFiles: handleDrop }), [
    handleDrop,
  ]);

  const dropAreaProps = mergeProps(
    {
      className: clsx(s.dropArea, sSingle.dropArea),
      'data-disabled': isDisabled || undefined,
      'data-invalid': invalid || undefined,
    },
    slotProps?.dropArea
  );

  return (
    <div
      {...other}
      ref={ref}
      className={clsx(s.root, className)}
      onBlur={(event) => {
        markTouched();
        onBlur?.(event);
      }}
    >
      <div {...dropAreaProps} ref={dropRef}>
        {value ? (
          <FileUploadItem
            item={value}
            isDisabled={isDisabled}
            hasError={invalid}
            size={
              showFileSize ? formatDataSize(value.file.size, locale) : undefined
            }
            icon={icon}
            progressMode={progressMode}
            removeLabel={t.format('remove')}
            onRemove={handleRemove}
          />
        ) : (
          <div className={s.dropzone}>
            <IconArrowUpFromBracket16 className={s.dropzoneIcon} />
            <FileUploadCaption
              captionContext={captionContext}
              inputId={inputId}
              accept={acceptAttr}
              isDisabled={isDisabled}
              onFileSelected={handleSelectViaClick}
              fileInputRef={browseInputRef}
            />
          </div>
        )}
      </div>
      {fullScreenActive ? (
        <FullScreenDropzone
          config={
            typeof fullScreenDropzone === 'object'
              ? fullScreenDropzone
              : undefined
          }
          disabled={isDisabled}
          onFilesDropped={handleDrop}
        />
      ) : null}
      {caption ? <div className={s.hint}>{caption}</div> : null}
      {invalid && errorMessage ? (
        <div className={s.error}>{errorMessage}</div>
      ) : null}
    </div>
  );
});

SingleFileUpload.displayName = 'SingleFileUpload';
