'use client';

import { forwardRef } from 'react';

import { clsx, useDOMRef } from '@koobiq/react-core';
import { IconCloudArrowUpO24 } from '@koobiq/react-icons';

import { EmptyState } from '../../../EmptyState';
import { useFileUploadContext } from '../../FileUploadContext';
import type {
  FileUploadEmptyProps,
  FileUploadEmptyIconProps,
  FileUploadEmptyTitleProps,
  FileUploadEmptyDescriptionProps,
} from '../../types';
import { FileUploadTriggers } from '../Trigger';

import s from './Empty.module.css';

export const FileUploadEmpty = forwardRef<HTMLDivElement, FileUploadEmptyProps>(
  (props, ref) => {
    const {
      children,
      className,
      style,
      'data-testid': testId,
      ...other
    } = props;

    const { size, isDisabled, allowsMultiple } = useFileUploadContext();
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
        className={clsx(s.empty, className)}
      >
        <EmptyState size="normal" className={s.large}>
          {children ?? (
            <>
              <FileUploadEmptyIcon />
              <FileUploadEmptyTitle />
              <FileUploadEmptyDescription />
            </>
          )}
        </EmptyState>
      </div>
    );
  }
);

export const FileUploadEmptyIcon = forwardRef<
  HTMLSpanElement,
  FileUploadEmptyIconProps
>((props, ref) => {
  const { children, className, style, 'data-testid': testId, ...other } = props;

  return (
    <EmptyState.Media
      as="span"
      {...other}
      ref={ref}
      style={style}
      data-testid={testId}
      className={clsx(s.icon, className)}
    >
      {children ?? <IconCloudArrowUpO24 />}
    </EmptyState.Media>
  );
});

export const FileUploadEmptyTitle = forwardRef<
  HTMLSpanElement,
  FileUploadEmptyTitleProps
>((props, ref) => {
  const { children, className, style, 'data-testid': testId, ...other } = props;
  const { messages } = useFileUploadContext();

  return (
    <EmptyState.Title
      as="span"
      {...other}
      ref={ref}
      style={style}
      data-testid={testId}
      className={clsx(s.title, className)}
    >
      {children ?? messages.emptyTitle}
    </EmptyState.Title>
  );
});

export const FileUploadEmptyDescription = forwardRef<
  HTMLSpanElement,
  FileUploadEmptyDescriptionProps
>((props, ref) => {
  const { children, className, style, 'data-testid': testId, ...other } = props;
  const { messages } = useFileUploadContext();

  return (
    <EmptyState.Content
      as="span"
      {...other}
      ref={ref}
      style={style}
      data-testid={testId}
      className={clsx(s.description, className)}
    >
      {children ?? (
        <>
          {messages.alternativeSeparator} <FileUploadTriggers />
        </>
      )}
    </EmptyState.Content>
  );
});

FileUploadEmpty.displayName = 'FileUpload.Empty';
FileUploadEmptyIcon.displayName = 'FileUpload.EmptyIcon';
FileUploadEmptyTitle.displayName = 'FileUpload.EmptyTitle';
FileUploadEmptyDescription.displayName = 'FileUpload.EmptyDescription';
