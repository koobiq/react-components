import { useCallback, useEffect, useRef } from 'react';
import type { RefObject } from 'react';

import { useBoolean } from '@koobiq/react-core';

import type { FileUploadFile } from '../types';
import { setFileRelativePath } from '../utils';

type UseFileDropTargetOptions = {
  ref: RefObject<HTMLElement | null>;
  isFullscreen?: boolean;
  isDisabled: boolean;
  onDrop: (files: FileUploadFile[]) => void;
};

const readFileEntry = (entry: FileSystemFileEntry): Promise<File> =>
  new Promise((resolve, reject) => entry.file(resolve, reject));

const readDirectoryBatch = (
  reader: FileSystemDirectoryReader
): Promise<FileSystemEntry[]> =>
  new Promise((resolve, reject) => reader.readEntries(resolve, reject));

const readDroppedEntry = async (
  entry: FileSystemEntry,
  directoryPath?: string
): Promise<FileUploadFile[]> => {
  if (entry.isFile) {
    const file = await readFileEntry(entry as FileSystemFileEntry);

    return [
      setFileRelativePath(
        file,
        directoryPath ? `${directoryPath}/${entry.name}` : ''
      ),
    ];
  }

  if (!entry.isDirectory) return [];

  const reader = (entry as FileSystemDirectoryEntry).createReader();

  const nextDirectoryPath = directoryPath
    ? `${directoryPath}/${entry.name}`
    : entry.name;

  const entries: FileSystemEntry[] = [];

  while (true) {
    const batch = await readDirectoryBatch(reader);

    if (batch.length === 0) break;

    entries.push(...batch);
  }

  const groups = await Promise.all(
    entries.map((child) => readDroppedEntry(child, nextDirectoryPath))
  );

  return groups.flat();
};

/**
 * Extracts native files from a drop. Dropped folders are expanded recursively;
 * non-file items are ignored.
 */
export const readDroppedFiles = async (
  dataTransfer: DataTransfer
): Promise<FileUploadFile[]> => {
  const items = Array.from(dataTransfer.items);

  const groups = await Promise.all(
    items.map((item) => {
      if (item.kind !== 'file') return Promise.resolve<FileUploadFile[]>([]);

      const entry = item.webkitGetAsEntry?.();

      if (entry) return readDroppedEntry(entry);

      const file = item.getAsFile();

      return Promise.resolve(file ? [setFileRelativePath(file, '')] : []);
    })
  );

  const files = groups.flat();

  return files.length > 0
    ? files
    : Array.from(dataTransfer.files, (file) =>
        setFileRelativePath(file, file.webkitRelativePath ?? '')
      );
};

const isFileDrag = (dataTransfer: DataTransfer | null): boolean => {
  if (!dataTransfer) return false;

  return (
    Array.from(dataTransfer.types).includes('Files') ||
    Array.from(dataTransfer.items).some((item) => item.kind === 'file') ||
    dataTransfer.files.length > 0
  );
};

export const useFileDropTarget = ({
  ref,
  isFullscreen,
  isDisabled,
  onDrop,
}: UseFileDropTargetOptions): boolean => {
  const [isDropTarget, { set: setIsDropTarget }] = useBoolean(false);
  const activeTargetRef = useRef<HTMLElement | null>(null);
  const dragDepthRef = useRef(0);

  const reset = useCallback(() => {
    activeTargetRef.current?.removeAttribute('data-drop-target');
    activeTargetRef.current = null;
    dragDepthRef.current = 0;
    setIsDropTarget(false);
  }, []);

  useEffect(() => {
    reset();

    if (isDisabled) return;

    const target = isFullscreen
      ? (ref.current?.ownerDocument ?? document).documentElement
      : ref.current;

    if (!target) return;

    const handleDragEnter = (event: DragEvent) => {
      if (!isFileDrag(event.dataTransfer)) return;

      event.preventDefault();
      event.stopPropagation();

      dragDepthRef.current += 1;

      if (activeTargetRef.current === target) return;

      activeTargetRef.current = target;
      target.setAttribute('data-drop-target', '');
      setIsDropTarget(true);
    };

    const handleDragOver = (event: DragEvent) => {
      if (!isFileDrag(event.dataTransfer)) return;

      event.preventDefault();
      event.stopPropagation();

      if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
    };

    const handleDragLeave = (event: DragEvent) => {
      if (activeTargetRef.current !== target) return;

      event.stopPropagation();
      dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);

      if (dragDepthRef.current === 0) reset();
    };

    const handleDrop = (event: DragEvent) => {
      if (!isFileDrag(event.dataTransfer) || !event.dataTransfer) return;

      event.preventDefault();
      event.stopPropagation();

      const { dataTransfer } = event;

      reset();

      void readDroppedFiles(dataTransfer).then(onDrop);
    };

    target.addEventListener('dragenter', handleDragEnter);
    target.addEventListener('dragover', handleDragOver);
    target.addEventListener('dragleave', handleDragLeave);
    target.addEventListener('drop', handleDrop);
    window.addEventListener('dragend', reset);
    window.addEventListener('drop', reset);
    window.addEventListener('blur', reset);

    return () => {
      target.removeEventListener('dragenter', handleDragEnter);
      target.removeEventListener('dragover', handleDragOver);
      target.removeEventListener('dragleave', handleDragLeave);
      target.removeEventListener('drop', handleDrop);
      window.removeEventListener('dragend', reset);
      window.removeEventListener('drop', reset);
      window.removeEventListener('blur', reset);

      if (activeTargetRef.current === target) {
        target.removeAttribute('data-drop-target');
        activeTargetRef.current = null;
        dragDepthRef.current = 0;
      }
    };
  }, [ref, isFullscreen, isDisabled, onDrop, reset]);

  return isDropTarget;
};
