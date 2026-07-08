'use client';

import { IconCloudArrowUpO24 } from '@koobiq/react-icons';

import { EmptyState } from '../../../EmptyState';
import { useFileUploadContext } from '../../FileUploadContext';
import { FileUploadTrigger } from '../Trigger';

import s from './EmptyLayout.module.css';

/**
 * The default multiple-empty layout: an `EmptyState` with a big upload icon, a
 * title and the browse link. Used only in `size="default"`; the `compact` size
 * falls back to the narrow `FileUploadDropzone` strip.
 */
export const FileUploadEmptyLayout = () => {
  const { messages } = useFileUploadContext();

  return (
    <EmptyState size="normal" className={s.base}>
      <EmptyState.Media className={s.media}>
        <IconCloudArrowUpO24 />
      </EmptyState.Media>
      <EmptyState.Title className={s.title}>
        {messages.dropTitle}
      </EmptyState.Title>
      <EmptyState.Content className={s.content}>
        {messages.or} <FileUploadTrigger />
      </EmptyState.Content>
    </EmptyState>
  );
};

FileUploadEmptyLayout.displayName = 'FileUpload.EmptyLayout';
