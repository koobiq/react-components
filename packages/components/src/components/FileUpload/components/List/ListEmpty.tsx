'use client';

import type { ComponentPropsWithRef } from 'react';
import { forwardRef } from 'react';

import { clsx, useDOMRef } from '@koobiq/react-core';
import { IconArrowUpFromBracket16 } from '@koobiq/react-icons';

import { useFileUploadContext } from '../../FileUploadContext';
import { FileUploadTriggers } from '../Trigger';

import s from './ListEmpty.module.css';

export const FileUploadListEmpty = forwardRef<
  HTMLDivElement,
  ComponentPropsWithRef<'div'>
>((props, ref) => {
  const { className, style, ...other } = props;

  const { size, messages, isDisabled, allowsMultiple } = useFileUploadContext();

  const domRef = useDOMRef<HTMLDivElement>(ref);

  return (
    <div
      {...other}
      ref={domRef}
      style={style}
      data-size={size}
      data-disabled={isDisabled || undefined}
      data-multiple={allowsMultiple || undefined}
      className={clsx(s.base, className)}
    >
      <span className={s.icon} aria-hidden="true">
        <IconArrowUpFromBracket16 />
      </span>
      <span className={s.description}>
        {messages.listEmptyText} {messages.alternativeSeparator}{' '}
        <FileUploadTriggers />
      </span>
    </div>
  );
});

FileUploadListEmpty.displayName = 'FileUploadListEmpty';
