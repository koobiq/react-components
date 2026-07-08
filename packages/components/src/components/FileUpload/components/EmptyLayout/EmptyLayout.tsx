'use client';

import { IconArrowUpFromBracket16 } from '@koobiq/react-icons';

import { EmptyState } from '../../../EmptyState';
import { IconItem } from '../../../IconItem';
import { useFileUploadContext } from '../../FileUploadContext';
import { FileUploadTrigger } from '../Trigger';

/**
 * The default multiple-empty layout: an `EmptyState` with a big upload icon, a
 * title and the browse link. Used only in `size="default"`; the `compact` size
 * falls back to the narrow `FileUploadDropzone` strip.
 */
export const FileUploadEmptyLayout = () => {
  const { messages } = useFileUploadContext();

  return (
    <EmptyState size="normal">
      <EmptyState.Media>
        <IconItem size="big" color="contrast">
          <IconArrowUpFromBracket16 />
        </IconItem>
      </EmptyState.Media>
      <EmptyState.Title>{messages.dropTitle}</EmptyState.Title>
      <EmptyState.Content>
        {messages.or} <FileUploadTrigger />
      </EmptyState.Content>
    </EmptyState>
  );
};

FileUploadEmptyLayout.displayName = 'FileUpload.EmptyLayout';
