'use client';

import { createContext, forwardRef, useContext } from 'react';

import { clsx, useDOMRef } from '@koobiq/react-core';
import {
  IconCloudArrowUpO24,
  IconArrowUpFromBracket16,
} from '@koobiq/react-icons';

import { EmptyState } from '../../../EmptyState';
import { useFileUploadContext } from '../../FileUploadContext';
import type {
  FileUploadEmptyProps,
  FileUploadEmptyIconProps,
  FileUploadEmptyTitleProps,
  FileUploadEmptyDescriptionProps,
} from '../../types';
import { FileUploadTrigger } from '../Trigger';

import s from './Empty.module.css';

type EmptyVariant = 'large' | 'compact';

const EmptyVariantContext = createContext<EmptyVariant>('compact');

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

    const variant: EmptyVariant =
      allowsMultiple && size === 'default' ? 'large' : 'compact';

    const content =
      children === undefined ? (
        <>
          <FileUploadEmptyIcon />
          {variant === 'large' && <FileUploadEmptyTitle />}
          <FileUploadEmptyDescription />
        </>
      ) : (
        children
      );

    if (variant === 'large') {
      return (
        <div
          {...other}
          ref={domRef}
          style={style}
          data-size={size}
          data-testid={testId}
          data-disabled={isDisabled || undefined}
          data-multiple={allowsMultiple || undefined}
          data-variant={variant}
          className={clsx(s.empty, className)}
        >
          <EmptyVariantContext.Provider value={variant}>
            <EmptyState size="normal" className={s.large}>
              {content}
            </EmptyState>
          </EmptyVariantContext.Provider>
        </div>
      );
    }

    return (
      <div
        {...other}
        ref={domRef}
        style={style}
        data-size={size}
        data-testid={testId}
        data-disabled={isDisabled || undefined}
        data-multiple={allowsMultiple || undefined}
        data-variant={variant}
        className={clsx(s.empty, s.compact, className)}
      >
        <EmptyVariantContext.Provider value={variant}>
          {content}
        </EmptyVariantContext.Provider>
      </div>
    );
  }
);

export const FileUploadEmptyIcon = forwardRef<
  HTMLSpanElement,
  FileUploadEmptyIconProps
>((props, ref) => {
  const { children, className, style, 'data-testid': testId, ...other } = props;
  const variant = useContext(EmptyVariantContext);

  const content =
    children ??
    (variant === 'large' ? (
      <IconCloudArrowUpO24 />
    ) : (
      <IconArrowUpFromBracket16 />
    ));

  if (variant === 'large') {
    return (
      <EmptyState.Media
        as="span"
        {...other}
        ref={ref}
        style={style}
        data-testid={testId}
        className={clsx(s.icon, className)}
      >
        {content}
      </EmptyState.Media>
    );
  }

  return (
    <span
      {...other}
      ref={ref}
      style={style}
      data-testid={testId}
      className={clsx(s.icon, className)}
      aria-hidden="true"
    >
      {content}
    </span>
  );
});

export const FileUploadEmptyTitle = forwardRef<
  HTMLSpanElement,
  FileUploadEmptyTitleProps
>((props, ref) => {
  const { children, className, style, 'data-testid': testId, ...other } = props;
  const { messages } = useFileUploadContext();
  const variant = useContext(EmptyVariantContext);
  const content = children ?? messages.dropTitle;

  if (variant === 'large') {
    return (
      <EmptyState.Title
        as="span"
        {...other}
        ref={ref}
        style={style}
        data-testid={testId}
        className={clsx(s.title, className)}
      >
        {content}
      </EmptyState.Title>
    );
  }

  return (
    <span
      {...other}
      ref={ref}
      style={style}
      data-testid={testId}
      className={clsx(s.title, className)}
    >
      {content}
    </span>
  );
});

export const FileUploadEmptyDescription = forwardRef<
  HTMLSpanElement,
  FileUploadEmptyDescriptionProps
>((props, ref) => {
  const { children, className, style, 'data-testid': testId, ...other } = props;
  const { messages } = useFileUploadContext();
  const variant = useContext(EmptyVariantContext);

  const content =
    children ??
    (variant === 'large' ? (
      <>
        {messages.or} <FileUploadTrigger />
      </>
    ) : (
      <>
        {messages.dropHere} {messages.or} <FileUploadTrigger />
      </>
    ));

  if (variant === 'large') {
    return (
      <EmptyState.Content
        as="span"
        {...other}
        ref={ref}
        style={style}
        data-testid={testId}
        className={clsx(s.description, className)}
      >
        {content}
      </EmptyState.Content>
    );
  }

  return (
    <span
      {...other}
      ref={ref}
      style={style}
      data-testid={testId}
      className={clsx(s.description, className)}
    >
      {content}
    </span>
  );
});

FileUploadEmpty.displayName = 'FileUpload.Empty';
FileUploadEmptyIcon.displayName = 'FileUpload.EmptyIcon';
FileUploadEmptyTitle.displayName = 'FileUpload.EmptyTitle';
FileUploadEmptyDescription.displayName = 'FileUpload.EmptyDescription';
