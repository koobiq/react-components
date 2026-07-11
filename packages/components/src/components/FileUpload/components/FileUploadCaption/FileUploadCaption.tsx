'use client';

import type { ChangeEvent, Ref } from 'react';

import s from '../../FileUpload.module.css';
import type { FileUploadCaptionContext } from '../../types';
import { FileInput } from '../FileInput';

export interface FileUploadCaptionProps {
  /** Resolved caption pieces. */
  captionContext: FileUploadCaptionContext;
  /** Overrides the leading caption text (e.g. the "when selected" text). */
  leadingText?: string;
  /** Id shared with the primary browse input. */
  inputId?: string;
  /** Joined `accept` specifiers for the file browse link. */
  accept?: string;
  /** Whether the browse links are disabled. */
  isDisabled?: boolean;
  /** Change handler for both browse inputs. */
  onFileSelected: (event: ChangeEvent<HTMLInputElement>) => void;
  /** Ref to the primary browse input (focus-return target). */
  fileInputRef?: Ref<HTMLInputElement>;
}

/**
 * Renders an empty-state caption: leading text plus one or two clickable browse
 * links (file and/or folder) that open the native file dialog.
 */
export const FileUploadCaption = (props: FileUploadCaptionProps) => {
  const {
    captionContext,
    leadingText,
    inputId,
    accept,
    isDisabled,
    onFileSelected,
    fileInputRef,
  } = props;

  const { captionText, browseLink, captionTextSeparator, browseLinkFolder } =
    captionContext;

  const text = leadingText ?? captionText;
  const hasFileLink = !!browseLink;

  return (
    <span className={s.caption}>
      {text ? <span className={s.captionText}>{text}</span> : null}
      {browseLink ? (
        <FileInput
          id={inputId}
          accept={accept}
          multiple
          isDisabled={isDisabled}
          onChange={onFileSelected}
          inputRef={fileInputRef}
        >
          {browseLink}
        </FileInput>
      ) : null}
      {captionTextSeparator ? (
        <span className={s.captionText}>{captionTextSeparator}</span>
      ) : null}
      {browseLinkFolder ? (
        <FileInput
          id={hasFileLink ? undefined : inputId}
          directory
          isDisabled={isDisabled}
          onChange={onFileSelected}
          inputRef={hasFileLink ? undefined : fileInputRef}
        >
          {browseLinkFolder}
        </FileInput>
      ) : null}
    </span>
  );
};

FileUploadCaption.displayName = 'FileUploadCaption';
