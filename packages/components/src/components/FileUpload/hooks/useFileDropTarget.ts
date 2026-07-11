import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

type UseFileDropTargetOptions = {
  rootRef: RefObject<HTMLElement | null>;
  dropzoneTarget?: 'fullscreen' | RefObject<HTMLElement | null>;
  isDisabled: boolean;
  onDrop: (files: File[]) => void;
};

const readFileEntry = (entry: FileSystemFileEntry): Promise<File> =>
  new Promise((resolve, reject) => entry.file(resolve, reject));

const readDirectoryBatch = (
  reader: FileSystemDirectoryReader
): Promise<FileSystemEntry[]> =>
  new Promise((resolve, reject) => reader.readEntries(resolve, reject));

const readDroppedEntry = async (entry: FileSystemEntry): Promise<File[]> => {
  if (entry.isFile) {
    return [await readFileEntry(entry as FileSystemFileEntry)];
  }

  if (!entry.isDirectory) return [];

  const reader = (entry as FileSystemDirectoryEntry).createReader();
  const entries: FileSystemEntry[] = [];

  while (true) {
    const batch = await readDirectoryBatch(reader);

    if (batch.length === 0) break;

    entries.push(...batch);
  }

  const groups = await Promise.all(entries.map(readDroppedEntry));

  return groups.flat();
};

/**
 * Extracts native files from a drop. Dropped folders are expanded recursively;
 * non-file items are ignored.
 */
export const readDroppedFiles = async (
  dataTransfer: DataTransfer
): Promise<File[]> => {
  const items = Array.from(dataTransfer.items);

  const groups = await Promise.all(
    items.map((item) => {
      if (item.kind !== 'file') return Promise.resolve<File[]>([]);

      const entry = item.webkitGetAsEntry?.();

      if (entry) return readDroppedEntry(entry);

      const file = item.getAsFile();

      return Promise.resolve(file ? [file] : []);
    })
  );

  const files = groups.flat();

  return files.length > 0 ? files : Array.from(dataTransfer.files);
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
  rootRef,
  dropzoneTarget,
  isDisabled,
  onDrop,
}: UseFileDropTargetOptions): boolean => {
  const [isDropTarget, setIsDropTarget] = useState(false);
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

    const target =
      dropzoneTarget === 'fullscreen'
        ? (rootRef.current?.ownerDocument ?? document).documentElement
        : dropzoneTarget
          ? dropzoneTarget.current
          : rootRef.current;

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
  }, [dropzoneTarget, isDisabled, onDrop, reset, rootRef]);

  return isDropTarget;
};
