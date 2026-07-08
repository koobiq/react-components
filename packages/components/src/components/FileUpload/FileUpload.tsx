'use client';

import {
  useRef,
  useMemo,
  forwardRef,
  useCallback,
  useLayoutEffect,
} from 'react';
import type { Ref } from 'react';

import type { Key } from '@koobiq/react-core';
import {
  clsx,
  useDOMRef,
  useBoolean,
  useKeyedRefs,
  useControlledState,
  useNumberFormatter,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';
import { DropZone } from '@koobiq/react-primitives';

import { formatFileSize } from '../../utils';

import { FileUploadDropzone } from './components/Dropzone';
import { FileUploadItemComponent } from './components/Item';
import { FileUploadList } from './components/List';
import { FileUploadTrigger } from './components/Trigger';
import s from './FileUpload.module.css';
import { FileUploadContext } from './FileUploadContext';
import type { FileUploadContextValue } from './FileUploadContext';
import intlMessages from './intl';
import type {
  FileUploadItem,
  FileUploadProps,
  FileUploadMessages,
} from './types';
import { readDroppedFiles, createFileUploadItem } from './utils';

const EMPTY_ITEMS: FileUploadItem[] = [];

type PendingFocus = { type: 'item'; id: Key } | { type: 'trigger' } | null;

function FileUploadRender(props: FileUploadProps, ref?: Ref<HTMLDivElement>) {
  const {
    accept,
    onAdd,
    style,
    value,
    onChange,
    onRemove,
    children,
    className,
    size = 'default',
    allowed = 'file',
    defaultValue,
    isDisabled = false,
    allowsMultiple = false,
    'data-testid': testId,
    showFileSize: showFileSizeProp,
    directoryMode = 'as-item',
    ...other
  } = props;

  const domRef = useDOMRef<HTMLDivElement>(ref);

  const [items, setItems] = useControlledState<FileUploadItem[]>(
    value,
    defaultValue ?? EMPTY_ITEMS,
    onChange
  );

  const [isDropTarget, { on: onDropTarget, off: offDropTarget }] =
    useBoolean(false);

  const showFileSize = showFileSizeProp ?? allowsMultiple;

  const stringFormatter = useLocalizedStringFormatter(intlMessages);
  const numberFormatter = useNumberFormatter({ maximumFractionDigits: 2 });

  const messages = useMemo<FileUploadMessages>(
    () => ({
      or: stringFormatter.format('or'),
      addMore: stringFormatter.format('addMore'),
      dropHere: stringFormatter.format('dropHere'),
      browseFile: stringFormatter.format('browseFile'),
      browseFiles: stringFormatter.format('browseFiles'),
      browseFolder: stringFormatter.format('browseFolder'),
      browseFilesOrFolder: stringFormatter.format('browseFilesOrFolder'),
      removeButtonLabel: stringFormatter.format('removeButtonLabel'),
      uploadingLabel: stringFormatter.format('uploadingLabel'),
      bytes: stringFormatter.format('bytes'),
      kilobytes: stringFormatter.format('kilobytes'),
      megabytes: stringFormatter.format('megabytes'),
      gigabytes: stringFormatter.format('gigabytes'),
      terabytes: stringFormatter.format('terabytes'),
    }),
    [stringFormatter]
  );

  const getItemRef = useKeyedRefs<HTMLButtonElement>();
  const triggerRef = useRef<HTMLElement | null>(null);
  const pendingFocus = useRef<PendingFocus>(null);

  const setTriggerRef = useCallback((element: HTMLElement | null) => {
    triggerRef.current = element;
  }, []);

  const formatSize = useCallback(
    (bytes: number) =>
      formatFileSize(bytes, {
        formatNumber: (fileSize) => numberFormatter.format(fileSize),
        unitLabels: {
          B: messages.bytes,
          KB: messages.kilobytes,
          MB: messages.megabytes,
          GB: messages.gigabytes,
          TB: messages.terabytes,
        },
      }),
    [numberFormatter, messages]
  );

  const addFiles = useCallback(
    (files: File[]) => {
      if (isDisabled || files.length === 0) return;

      const added = files.map(createFileUploadItem);
      const next = allowsMultiple ? [...items, ...added] : added.slice(0, 1);

      setItems(next);
      onAdd?.(allowsMultiple ? added : next, next);
    },
    [isDisabled, allowsMultiple, items, setItems, onAdd]
  );

  const removeItem = useCallback(
    (id: Key) => {
      const index = items.findIndex((item) => item.id === id);

      if (index < 0) return;

      const removed = items[index];
      const next = items.filter((item) => item.id !== id);
      const neighbor = items[index + 1] ?? items[index - 1];

      pendingFocus.current = neighbor
        ? { type: 'item', id: neighbor.id }
        : { type: 'trigger' };

      setItems(next);
      onRemove?.(removed, index, next);
    },
    [items, setItems, onRemove]
  );

  useLayoutEffect(() => {
    const pending = pendingFocus.current;

    if (!pending) return;

    pendingFocus.current = null;

    if (pending.type === 'item') {
      getItemRef(pending.id).current?.focus();
    } else {
      triggerRef.current?.focus();
    }
  }, [items]);

  const contextValue = useMemo<FileUploadContextValue>(
    () => ({
      items,
      accept,
      allowed,
      size,
      directoryMode,
      showFileSize,
      isDisabled,
      isDropTarget,
      allowsMultiple,
      addFiles,
      removeItem,
      getItemRef,
      setTriggerRef,
      messages,
      formatSize,
    }),
    [
      items,
      accept,
      allowed,
      size,
      directoryMode,
      showFileSize,
      isDisabled,
      isDropTarget,
      allowsMultiple,
      addFiles,
      removeItem,
      getItemRef,
      setTriggerRef,
      messages,
      formatSize,
    ]
  );

  const isEmpty = items.length === 0;

  return (
    <FileUploadContext.Provider value={contextValue}>
      <DropZone
        {...other}
        ref={domRef}
        style={style}
        isDisabled={isDisabled}
        data-size={size}
        data-testid={testId}
        data-empty={isEmpty || undefined}
        data-multiple={allowsMultiple || undefined}
        className={clsx(s.base, s[size], className)}
        getDropOperation={() => 'copy'}
        onDropEnter={onDropTarget}
        onDropExit={offDropTarget}
        onDrop={async (event) => {
          offDropTarget();

          const files = await readDroppedFiles(event.items);

          if (files.length > 0) {
            addFiles(files);
          }
        }}
      >
        {children ?? (
          <>
            {!isEmpty && <FileUploadList />}
            {(isEmpty || allowsMultiple) && <FileUploadDropzone />}
          </>
        )}
      </DropZone>
    </FileUploadContext.Provider>
  );
}

const FileUploadComponent = forwardRef(FileUploadRender);

type CompoundedComponent = typeof FileUploadComponent & {
  Dropzone: typeof FileUploadDropzone;
  Trigger: typeof FileUploadTrigger;
  List: typeof FileUploadList;
  Item: typeof FileUploadItemComponent;
};

/**
 * `FileUpload` lets users pick, display and manage a list of files. It handles
 * selection (system dialog and drag-and-drop), the file list and removal, but
 * never uploads anything: the consumer drives loading/error state from the
 * outside via the controlled `value`.
 */
export const FileUpload = FileUploadComponent as CompoundedComponent;

FileUpload.Dropzone = FileUploadDropzone;
FileUpload.Trigger = FileUploadTrigger;
FileUpload.List = FileUploadList;
FileUpload.Item = FileUploadItemComponent;

FileUpload.displayName = 'FileUpload';
