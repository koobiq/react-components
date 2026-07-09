'use client';

import { clsx } from '@koobiq/react-core';
import { createPortal } from 'react-dom';

import { useFullScreenDropzone } from '../../hooks/useFullScreenDropzone';
import type { DropzoneData, FileWithPath } from '../../types';
import { DropzoneContent } from '../DropzoneContent';

import s from './FullScreenDropzone.module.css';

export interface FullScreenDropzoneProps {
  /** Overlay content configuration. */
  config?: DropzoneData;
  /** When `true`, drag events are ignored. */
  disabled?: boolean;
  /** Fires with the (directory-expanded) dropped files. */
  onFilesDropped: (files: FileWithPath[]) => void;
  /** Additional CSS-classes for the overlay. */
  className?: string;
}

/**
 * A full-viewport overlay portalled to `document.body` that opens while a file
 * is dragged over the document and routes the drop to `onFilesDropped`.
 */
export const FullScreenDropzone = (props: FullScreenDropzoneProps) => {
  const { config, disabled, onFilesDropped, className } = props;

  const { isOpen } = useFullScreenDropzone({
    enabled: true,
    disabled,
    onFilesDropped,
  });

  if (!isOpen || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div className={clsx(s.overlay, className)} data-attached>
      <DropzoneContent
        title={config?.title}
        caption={config?.caption}
        size={config?.size ?? 'normal'}
        autoCapture={config?.autoCapture}
      />
    </div>,
    document.body
  );
};

FullScreenDropzone.displayName = 'FullScreenDropzone';
