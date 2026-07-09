'use client';

import { useEffect, useRef, useState } from 'react';

import type { FileWithPath } from '../../types';
import {
  extractDroppedFiles,
  isFolderDragSupported,
  isOutsideViewport,
  isSafari,
} from '../../utils';

export interface UseFullScreenDropzoneParams {
  /** Whether the full-screen dropzone is enabled. */
  enabled: boolean;
  /** When `true`, drag events are ignored. */
  disabled?: boolean;
  /** Fires with the (directory-expanded) dropped files. */
  onFilesDropped: (files: FileWithPath[]) => void;
}

export interface UseFullScreenDropzoneReturn {
  /** Whether the overlay is currently open. */
  isOpen: boolean;
}

/**
 * Opens a full-viewport overlay when a drag enters the document, and routes the
 * drop to `onFilesDropped`. Listeners are attached to `document.body` and the
 * overlay is expected to be a child of `body`, so drops bubble to these
 * handlers. Ported from the Angular `KbqFullScreenDropzoneService`.
 */
export function useFullScreenDropzone(
  params: UseFullScreenDropzoneParams
): UseFullScreenDropzoneReturn {
  const { enabled, disabled, onFilesDropped } = params;
  const [isOpen, setOpen] = useState(false);

  const disabledRef = useRef(disabled);

  disabledRef.current = disabled;

  const onDropRef = useRef(onFilesDropped);

  onDropRef.current = onFilesDropped;

  useEffect(() => {
    if (!enabled || typeof document === 'undefined') {
      return;
    }

    const body = document.body;

    const onDragEnter = (event: DragEvent) => {
      if (disabledRef.current) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      setOpen(true);
    };

    const onDragOver = (event: DragEvent) => {
      if (disabledRef.current) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
    };

    const onDragLeave = (event: DragEvent) => {
      if (disabledRef.current) {
        return;
      }

      const current = event.currentTarget as HTMLElement | null;
      const related = event.relatedTarget as Node | null;

      const withinViewport = isSafari()
        ? !isOutsideViewport({
            clientX: event.clientX,
            clientY: event.clientY,
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight,
            xAxisMinThreshold: 0,
            yAxisMinThreshold: 0,
          })
        : !!(current && related && current.contains(related));

      if (withinViewport) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
    };

    const onDrop = (event: DragEvent) => {
      if (disabledRef.current) {
        return;
      }

      if (!isFolderDragSupported()) {
        console.warn(
          'Drag-and-drop functionality for folders is not supported by this browser.'
        );
      }

      event.preventDefault();
      event.stopPropagation();
      setOpen(false);

      if (event.dataTransfer && event.dataTransfer.items.length > 0) {
        void extractDroppedFiles(event.dataTransfer).then((files) =>
          onDropRef.current(files)
        );
      }
    };

    body.addEventListener('dragenter', onDragEnter);
    body.addEventListener('dragover', onDragOver);
    body.addEventListener('dragleave', onDragLeave);
    body.addEventListener('drop', onDrop);

    return () => {
      body.removeEventListener('dragenter', onDragEnter);
      body.removeEventListener('dragover', onDragOver);
      body.removeEventListener('dragleave', onDragLeave);
      body.removeEventListener('drop', onDrop);
      setOpen(false);
    };
  }, [enabled]);

  useEffect(() => {
    if (disabled) {
      setOpen(false);
    }
  }, [disabled]);

  return { isOpen };
}
