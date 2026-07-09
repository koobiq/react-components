'use client';

import { forwardRef } from 'react';

import { clsx, useDOMRef } from '@koobiq/react-core';
import { IconArrowUpFromBracket16 } from '@koobiq/react-icons';

import { useFileUploadContext } from '../../FileUploadContext';
import type { FileUploadAddMoreProps } from '../../types';
import { FileUploadTrigger } from '../Trigger';

import s from './AddMore.module.css';

export const FileUploadAddMore = forwardRef<
  HTMLDivElement,
  FileUploadAddMoreProps
>((props, ref) => {
  const { children, className, style, 'data-testid': testId, ...other } = props;

  const { size, messages, isDisabled, isDropTarget, allowsMultiple } =
    useFileUploadContext();

  const domRef = useDOMRef<HTMLDivElement>(ref);

  return (
    <div
      {...other}
      ref={domRef}
      style={style}
      data-size={size}
      data-testid={testId}
      data-disabled={isDisabled || undefined}
      data-multiple={allowsMultiple || undefined}
      data-drop-target={isDropTarget || undefined}
      className={clsx(s.base, className)}
    >
      {children ?? (
        <>
          <span className={s.icon} aria-hidden="true">
            <IconArrowUpFromBracket16 />
          </span>
          <span className={s.text}>
            {messages.addMore} <FileUploadTrigger />
          </span>
        </>
      )}
    </div>
  );
});

FileUploadAddMore.displayName = 'FileUpload.AddMore';
