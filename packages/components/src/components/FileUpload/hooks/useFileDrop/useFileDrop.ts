'use client';

import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

import type { FileWithPath } from '../../types';
import { extractDroppedFiles, isFolderDragSupported } from '../../utils';

export interface UseFileDropParams {
  /** When `true`, all drag events are ignored. */
  disabled?: boolean;
  /** Fires with the (directory-expanded) list of dropped files. */
  onFilesDropped: (files: FileWithPath[]) => void;
}

export interface UseFileDropReturn<E extends HTMLElement> {
  /** Ref to attach to the drop target. */
  dropRef: RefObject<E | null>;
}

/**
 * Attaches native drag-and-drop listeners to a ref. The drag-over highlight is
 * driven by a `data-dragover` attribute written directly on the node (no React
 * state), so high-frequency drag events never cause re-renders. Ported from the
 * Angular `KbqFileDropDirective`.
 */
export function useFileDrop<E extends HTMLElement = HTMLElement>(
  params: UseFileDropParams
): UseFileDropReturn<E> {
  const { disabled, onFilesDropped } = params;
  const dropRef = useRef<E>(null);

  const disabledRef = useRef(disabled);

  disabledRef.current = disabled;

  const onDropRef = useRef(onFilesDropped);

  onDropRef.current = onFilesDropped;

  useEffect(() => {
    const el = dropRef.current;

    if (!el) {
      return;
    }

    const setDragover = (active: boolean) => {
      if (active) {
        el.setAttribute('data-dragover', 'true');
      } else {
        el.removeAttribute('data-dragover');
      }
    };

    const onDragEnter = (event: DragEvent) => {
      if (disabledRef.current) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      setDragover(true);
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

      // Moving onto a descendant must not clear the highlight.
      if (current && related && current.contains(related)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      setDragover(false);
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
      setDragover(false);

      if (event.dataTransfer && event.dataTransfer.items.length > 0) {
        void extractDroppedFiles(event.dataTransfer).then((files) =>
          onDropRef.current(files)
        );
      }
    };

    el.addEventListener('dragenter', onDragEnter);
    el.addEventListener('dragover', onDragOver);
    el.addEventListener('dragleave', onDragLeave);
    el.addEventListener('drop', onDrop);

    return () => {
      el.removeEventListener('dragenter', onDragEnter);
      el.removeEventListener('dragover', onDragOver);
      el.removeEventListener('dragleave', onDragLeave);
      el.removeEventListener('drop', onDrop);
    };
  }, []);

  return { dropRef };
}
