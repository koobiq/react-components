'use client';

import { forwardRef } from 'react';

import { clsx, useDOMRef } from '@koobiq/react-core';

import { useFileUploadContext } from '../../FileUploadContext';
import type { FileUploadListProps } from '../../types';
import { FileUploadItem } from '../Item';

import s from './List.module.css';

/**
 * The list of selected files. With no children it renders the default
 * `FileUpload.Item` for each item from the context (works for both controlled
 * and uncontrolled usage); pass children to compose the rows yourself.
 */
export const FileUploadList = forwardRef<HTMLUListElement, FileUploadListProps>(
  (props, ref) => {
    const {
      children,
      className,
      style,
      'data-testid': testId,
      ...other
    } = props;

    const { items } = useFileUploadContext();
    const domRef = useDOMRef<HTMLUListElement>(ref);

    return (
      <ul
        {...other}
        ref={domRef}
        style={style}
        data-testid={testId}
        className={clsx(s.base, className)}
      >
        {children ??
          items.map((item) => <FileUploadItem key={item.id} item={item} />)}
      </ul>
    );
  }
);

FileUploadList.displayName = 'FileUpload.List';
