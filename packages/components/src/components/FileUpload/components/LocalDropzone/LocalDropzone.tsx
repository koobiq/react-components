'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';

import { clsx } from '@koobiq/react-core';
import { createPortal } from 'react-dom';

import type { DropzoneData, FileUploadDropTarget } from '../../types';
import {
  extractDroppedFiles,
  isFolderDragSupported,
  isOutsideViewport,
  isSafari,
} from '../../utils';
import { DropzoneContent } from '../DropzoneContent';

import s from './LocalDropzone.module.css';

interface HostRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface LocalDropzoneProps {
  /** Ref to a connected component's imperative handle (its `dropTargetRef`). */
  connectedTo: RefObject<FileUploadDropTarget | null>;
  /** Overlay content configuration. */
  config?: DropzoneData;
  /** When `true`, drag events are ignored. */
  disabled?: boolean;
  /** The host region that becomes a dropzone. */
  children: ReactNode;
  /** Additional CSS-classes for the host wrapper. */
  className?: string;
}

/**
 * Turns its host region into a scoped dropzone: on drag-enter it opens an
 * overlay positioned over the host and routes the drop to the connected upload
 * component. Ported from the Angular `KbqLocalDropzone`. The portalled overlay
 * uses native listeners (React synthetic events on portals are unreliable).
 */
export const LocalDropzone = (props: LocalDropzoneProps) => {
  const { connectedTo, config, disabled, children, className } = props;
  const hostRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<HostRect | null>(null);
  const isOpen = rect !== null;

  const disabledRef = useRef(disabled);

  disabledRef.current = disabled;

  const measure = (): HostRect | null => {
    const el = hostRef.current;

    if (!el) {
      return null;
    }

    const r = el.getBoundingClientRect();

    return { top: r.top, left: r.left, width: r.width, height: r.height };
  };

  // Keep the overlay aligned with the host while it is open.
  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') {
      return;
    }

    const update = () => {
      const next = measure();

      if (next) {
        setRect(next);
      }
    };

    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [isOpen]);

  // Native drag listeners on the portalled overlay.
  useEffect(() => {
    const el = overlayRef.current;

    if (!el) {
      return;
    }

    const onDragOver = (event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
    };

    const onDragLeave = (event: DragEvent) => {
      const related = event.relatedTarget as Node | null;
      const r = el.getBoundingClientRect();

      const withinHost = isSafari()
        ? !isOutsideViewport({
            clientX: event.clientX,
            clientY: event.clientY,
            innerWidth: r.right,
            innerHeight: r.bottom,
            xAxisMinThreshold: r.left,
            yAxisMinThreshold: r.top,
          })
        : !!(related && el.contains(related));

      if (withinHost) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      setRect(null);
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

      if (event.dataTransfer && event.dataTransfer.items.length > 0) {
        void extractDroppedFiles(event.dataTransfer).then((files) =>
          connectedTo.current?.addFiles(files)
        );
      }

      setRect(null);
    };

    el.addEventListener('dragover', onDragOver);
    el.addEventListener('dragleave', onDragLeave);
    el.addEventListener('drop', onDrop);

    return () => {
      el.removeEventListener('dragover', onDragOver);
      el.removeEventListener('dragleave', onDragLeave);
      el.removeEventListener('drop', onDrop);
    };
  }, [isOpen, connectedTo]);

  return (
    <div
      ref={hostRef}
      className={clsx(s.host, className)}
      onDragEnter={(event) => {
        if (disabled) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();

        const next = measure();

        if (next) {
          setRect(next);
        }
      }}
      onDragOver={(event) => {
        if (disabled) {
          return;
        }

        event.preventDefault();
      }}
    >
      {children}
      {isOpen && rect && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={overlayRef}
              className={s.overlay}
              style={{
                position: 'fixed',
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
              }}
            >
              <DropzoneContent
                title={config?.title}
                caption={config?.caption}
                size={config?.size ?? 'normal'}
                autoCapture={config?.autoCapture}
              />
            </div>,
            document.body
          )
        : null}
    </div>
  );
};

LocalDropzone.displayName = 'LocalDropzone';
