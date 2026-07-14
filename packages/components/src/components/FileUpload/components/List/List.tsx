'use client';

import type { ComponentPropsWithRef, ReactNode } from 'react';
import { forwardRef } from 'react';

import { clsx } from '@koobiq/react-core';

import { utilClasses } from '../../../../styles/utility';
import type { FileUploadListSlotProps, FileUploadPropSize } from '../../types';
import { FileUploadEmpty } from '../Empty';

import s from './List.module.css';
import { FileUploadListAddMore } from './ListAddMore';
import { FileUploadListEmpty } from './ListEmpty';

type FileUploadListProps = Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  children: ReactNode;
  slots?: FileUploadListSlotProps;
  size: FileUploadPropSize;
  isEmpty: boolean;
  allowsMultiple: boolean;
  showsLargeEmpty: boolean;
  renderEmptyState?: () => ReactNode;
};

const textNormal = utilClasses.typography['text-normal'];

const FileUploadListEmptyState = ({
  slots,
  showsLargeEmpty,
  renderEmptyState,
}: Pick<
  FileUploadListProps,
  'slots' | 'showsLargeEmpty' | 'renderEmptyState'
>) => {
  if (showsLargeEmpty) {
    return renderEmptyState ? renderEmptyState() : <FileUploadEmpty />;
  }

  return <FileUploadListEmpty {...slots?.emptyState} />;
};

const FileUploadListFiles = ({
  children,
  slots,
  size,
  allowsMultiple,
}: Pick<
  FileUploadListProps,
  'children' | 'slots' | 'size' | 'allowsMultiple'
>) => {
  const { className, ...props } = slots?.fileList ?? {};

  return (
    <div
      {...props}
      className={clsx(s.list, className)}
      data-multiple={allowsMultiple || undefined}
      data-size={size}
    >
      {children}
    </div>
  );
};

export const FileUploadList = forwardRef<HTMLDivElement, FileUploadListProps>(
  (
    {
      children,
      slots,
      size,
      isEmpty,
      allowsMultiple,
      showsLargeEmpty,
      renderEmptyState,
      className,
      ...other
    },
    ref
  ) => {
    const contentProps = {
      children,
      slots,
      size,
      isEmpty,
      allowsMultiple,
      showsLargeEmpty,
      renderEmptyState,
    };

    let content = <FileUploadListEmptyState {...contentProps} />;

    if (!isEmpty) {
      content = (
        <>
          <FileUploadListFiles {...contentProps} />
          {allowsMultiple && <FileUploadListAddMore {...slots?.addMore} />}
        </>
      );
    }

    return (
      <div
        {...other}
        ref={ref}
        data-slot="file-upload-control"
        className={clsx(s.base, textNormal, className)}
      >
        {content}
      </div>
    );
  }
);

FileUploadList.displayName = 'FileUploadList';
