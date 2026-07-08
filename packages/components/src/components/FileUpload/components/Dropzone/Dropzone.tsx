'use client';

import { forwardRef } from 'react';

import { clsx, useDOMRef } from '@koobiq/react-core';
import { IconArrowUpFromBracket16 } from '@koobiq/react-icons';

import { useFileUploadContext } from '../../FileUploadContext';
import type { FileUploadDropzoneProps } from '../../types';
import { FileUploadTrigger } from '../Trigger';

import s from './Dropzone.module.css';

/**
 * The upload area. Shows the empty state with the browse link when nothing is
 * selected, and a compact "add more" strip once the list has items.
 *
 * The actual drop handling lives on the `FileUpload` root (the whole component
 * is the drop zone); this part only reflects the drag state via
 * `data-drop-target` for styling.
 */
export const FileUploadDropzone = forwardRef<
  HTMLDivElement,
  FileUploadDropzoneProps
>((props, ref) => {
  const { children, className, style, 'data-testid': testId, ...other } = props;

  const { items, messages, isDisabled, isDropTarget, allowsMultiple } =
    useFileUploadContext();

  const domRef = useDOMRef<HTMLDivElement>(ref);
  const isAddMore = items.length > 0;

  return (
    <div
      {...other}
      ref={domRef}
      style={style}
      data-testid={testId}
      data-disabled={isDisabled || undefined}
      data-multiple={allowsMultiple || undefined}
      data-drop-target={isDropTarget || undefined}
      data-variant={isAddMore ? 'add-more' : 'empty'}
      className={clsx(s.base, isAddMore ? s.addMore : s.empty, className)}
    >
      {children ?? (
        <>
          {!isAddMore && (
            <span className={s.icon} aria-hidden="true">
              <IconArrowUpFromBracket16 />
            </span>
          )}
          <span className={s.text}>
            {isAddMore
              ? messages.addMore
              : `${messages.dropHere} ${messages.or}`}{' '}
            <FileUploadTrigger />
          </span>
        </>
      )}
    </div>
  );
});

FileUploadDropzone.displayName = 'FileUpload.Dropzone';
