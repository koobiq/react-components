'use client';

import { forwardRef, useId, useImperativeHandle, useRef } from 'react';
import type { ChangeEvent } from 'react';

import { deprecate } from '@koobiq/logger';
import {
  clsx,
  mergeProps,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';
import {
  IconArrowUpFromBracket16,
  IconCloudArrowUpO24,
} from '@koobiq/react-icons';

import { utilClasses } from '../../styles/utility';
import { EmptyState } from '../EmptyState';

import { FileUploadCaption } from './components/FileUploadCaption';
import { FileUploadItem } from './components/FileUploadItem';
import { FullScreenDropzone } from './components/FullScreenDropzone';
import { FOCUS_RETURN_DELAY } from './constants';
import s from './FileUpload.module.css';
import { useFileUploadContext } from './FileUploadContext';
import { useFileDrop } from './hooks/useFileDrop';
import { useFileList } from './hooks/useFileList';
import { useMultipleFileUploadLocale } from './hooks/useFileUploadLocale';
import { useFileUploadState } from './hooks/useFileUploadState';
import intlMessages from './intl.json';
import sMultiple from './MultipleFileUpload.module.css';
import type { FileItem, FileWithPath, MultipleFileUploadProps } from './types';
import { formatDataSize, mapToFileItem } from './utils';

/**
 * MultipleFileUpload lets a user select or drop many files. Files are appended
 * in selection order with no dedupe, limit, or validation; removal is by index.
 * Validation is external — `accept` is a browse hint only and is not enforced on
 * drop.
 */
export const MultipleFileUpload = forwardRef<
  HTMLDivElement,
  MultipleFileUploadProps
>((props, ref) => {
  const {
    value: valueProp,
    defaultValue,
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
    size = 'default',
    progressMode = 'determinate',
    inputId: inputIdProp,
    localeConfig,
    renderFileIcon,
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
      'MultipleFileUpload: the "disabled" prop is deprecated. Use "isDisabled" prop to replace it.'
    );
  }

  const context = useFileUploadContext();
  const isDisabled = isDisabledProp ?? disabled ?? context?.isDisabled ?? false;
  const isInvalid = isInvalidProp ?? false;
  const generatedId = useId();
  const inputId = inputIdProp ?? context?.id ?? generatedId;

  const t = useLocalizedStringFormatter(intlMessages);

  const fileList = useFileList<FileItem>({
    list: valueProp,
    defaultList: defaultValue ?? [],
    onListChange: onChange,
    onItemsAdded: onFilesAdded,
    onItemRemoved: onFileRemoved,
  });

  const files = fileList.list;

  const { errorState, markTouched, markDirty } = useFileUploadState({
    isInvalid,
    shouldShowError,
  });

  const invalid = errorState;

  const { locale, config, captionContext, whenSelectedText } =
    useMultipleFileUploadLocale({
      allowed,
      size,
      hasFiles: files.length > 0,
      localeConfig,
    });

  const browseInputRef = useRef<HTMLInputElement>(null);
  const acceptAttr = accept?.length ? accept.join(',') : undefined;
  const fullScreenActive = !!fullScreenDropzone;

  const addFiles = (toAdd: File[]) => {
    if (!toAdd.length) {
      return;
    }

    fileList.addArray(toAdd.map(mapToFileItem));
    markDirty();
  };

  const handleSelectViaClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (isDisabled) {
      return;
    }

    addFiles(event.target.files ? Array.from(event.target.files) : []);
    markTouched();
  };

  const handleDrop = (dropped: FileWithPath[]) => {
    if (isDisabled) {
      return;
    }

    addFiles(dropped);
    markTouched();
  };

  const handleRemove = (index: number) => {
    if (isDisabled) {
      return;
    }

    const willBeEmpty = files.length <= 1;

    fileList.removeAt(index);
    markTouched();

    if (willBeEmpty) {
      setTimeout(() => browseInputRef.current?.focus(), FOCUS_RETURN_DELAY);
    }
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
      className: clsx(
        s.dropArea,
        sMultiple.dropArea,
        size === 'compact' && sMultiple.compact
      ),
      'data-disabled': isDisabled || undefined,
      'data-invalid': invalid || undefined,
      'data-size': size,
      'data-empty': files.length === 0 || undefined,
    },
    slotProps?.dropArea
  );

  const captionElement = (
    <FileUploadCaption
      captionContext={captionContext}
      leadingText={
        files.length > 0 ? whenSelectedText : captionContext.captionText
      }
      inputId={inputId}
      accept={acceptAttr}
      isDisabled={isDisabled}
      onFileSelected={handleSelectViaClick}
      fileInputRef={browseInputRef}
    />
  );

  const renderEmptyState = () => {
    if (size === 'compact') {
      return (
        <div className={s.dropzone}>
          <IconArrowUpFromBracket16 className={s.dropzoneIcon} />
          {captionElement}
        </div>
      );
    }

    return (
      <EmptyState
        size="normal"
        isInvalid={invalid}
        className={sMultiple.emptyState}
      >
        <EmptyState.Media>
          <IconCloudArrowUpO24 />
        </EmptyState.Media>
        <EmptyState.Title>{config.title}</EmptyState.Title>
        <EmptyState.Content>{captionElement}</EmptyState.Content>
      </EmptyState>
    );
  };

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
        {files.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className={sMultiple.wrapper}>
            <ul className={clsx(sMultiple.list, utilClasses.scrollable)}>
              {files.map((file, index) => (
                <li key={index} className={sMultiple.listItem}>
                  <FileUploadItem
                    item={file}
                    isDisabled={isDisabled}
                    hasError={file.hasError}
                    size={formatDataSize(file.file.size, locale)}
                    icon={renderFileIcon?.(file)}
                    progressMode={progressMode}
                    removeLabel={t.format('remove')}
                    onRemove={() => handleRemove(index)}
                  />
                </li>
              ))}
            </ul>
            <div className={clsx(s.dropzone, sMultiple.footer)}>
              <IconArrowUpFromBracket16 className={s.dropzoneIcon} />
              {captionElement}
            </div>
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

MultipleFileUpload.displayName = 'MultipleFileUpload';
