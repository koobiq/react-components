'use client';

import type { Ref } from 'react';
import {
  useRef,
  useMemo,
  forwardRef,
  useCallback,
  useContext,
  useLayoutEffect,
} from 'react';

import type {
  Key,
  Node,
  Collection as AriaCollection,
} from '@koobiq/react-core';
import {
  clsx,
  useDOMRef,
  useKeyedRefs,
  useNumberFormatter,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';
import {
  Collection,
  CollectionBuilder,
  CollectionRendererContext,
} from '@koobiq/react-primitives';

import { utilClasses } from '../../styles/utility';
import { formatFileSize } from '../../utils';

import {
  FileUploadAddMore,
  FileUploadEmpty,
  FileUploadEmptyIcon,
  FileUploadEmptyTitle,
  FileUploadItem,
  FileUploadItemContent,
  FileUploadItemIcon,
  FileUploadItemName,
  FileUploadItemSize,
  FileUploadRemoveButton,
  FileUploadTrigger,
  FileUploadEmptyDescription,
} from './components';
import { FileUploadDropTargetOverlay } from './components/DropTargetOverlay';
import s from './FileUpload.module.css';
import type { FileUploadContextValue } from './FileUploadContext';
import { FileUploadContext } from './FileUploadContext';
import { useFileDropTarget } from './hooks';
import intlMessages from './intl';
import type {
  FileUploadComponent,
  FileUploadMessages,
  FileUploadProps,
} from './types';

const textNormal = utilClasses.typography['text-normal'];

type PendingFocus = { type: 'item'; id: Key } | { type: 'trigger' } | null;

type FileUploadInnerProps<T extends object> = {
  props: Omit<FileUploadProps<T>, 'ref' | 'items' | 'children'>;
  collection: AriaCollection<Node<T>>;
  rootRef?: Ref<HTMLDivElement>;
};

const getCollectionKeys = <T extends object>(
  collection: AriaCollection<Node<T>>
): Key[] => Array.from(collection, (node) => node.key);

function FileUploadInner<T extends object>({
  props,
  rootRef,
  collection,
}: FileUploadInnerProps<T>) {
  const {
    isInvalid: isInvalidProp = false,
    allowsMultiple = false,
    isDisabled = false,
    allowed = 'file',
    size = 'default',
    accept,
    onAdd,
    style,
    onRemove,
    className,
    slotProps,
    dropzoneTarget,
    renderAddMore,
    renderEmptyState,
    'data-testid': testId,
    ...other
  } = props;

  const domRef = useDOMRef<HTMLDivElement>(rootRef);
  const { CollectionRoot } = useContext(CollectionRendererContext);

  const isEmpty = collection.size === 0;

  const collectionKeys = useMemo(
    () => getCollectionKeys(collection),
    [collection]
  );

  const stringFormatter = useLocalizedStringFormatter(intlMessages);
  const numberFormatter = useNumberFormatter({ maximumFractionDigits: 2 });

  const messages = useMemo<FileUploadMessages>(
    () => ({
      or: stringFormatter.format('or'),
      addMore: stringFormatter.format('addMore'),
      dropHere: stringFormatter.format('dropHere'),
      dropTitle: stringFormatter.format('dropTitle'),
      browseFile: stringFormatter.format('browseFile'),
      browseFiles: stringFormatter.format('browseFiles'),
      browseFolder: stringFormatter.format('browseFolder'),
      browseFilesOrFolder: stringFormatter.format('browseFilesOrFolder'),
      browseFolderMixed: stringFormatter.format('browseFolderMixed'),
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

      onAdd?.(allowsMultiple ? files : files.slice(0, 1));
    },
    [isDisabled, allowsMultiple, onAdd]
  );

  const isDropTarget = useFileDropTarget({
    rootRef: domRef,
    dropzoneTarget,
    isDisabled,
    onDrop: addFiles,
  });

  const removeItem = useCallback(
    (id: Key) => {
      if (isDisabled) return;

      const index = collectionKeys.indexOf(id);

      if (index < 0) return;

      const neighbor = collectionKeys[index + 1] ?? collectionKeys[index - 1];

      pendingFocus.current = neighbor
        ? { type: 'item', id: neighbor }
        : { type: 'trigger' };

      onRemove?.(id);
    },
    [isDisabled, collectionKeys, onRemove]
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
  }, [collectionKeys, getItemRef]);

  const contextValue = useMemo<FileUploadContextValue>(
    () => ({
      accept,
      allowed,
      size,
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
      accept,
      allowed,
      size,
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

  const { className: listClassName, ...listProps } = slotProps?.list ?? {};
  const isFullscreen = dropzoneTarget === 'fullscreen';

  const overlayTarget =
    dropzoneTarget === 'fullscreen'
      ? (domRef.current?.ownerDocument.documentElement ?? null)
      : (dropzoneTarget?.current ?? null);

  return (
    <FileUploadContext.Provider value={contextValue}>
      <div
        {...other}
        ref={domRef}
        style={style}
        data-size={size}
        data-testid={testId}
        data-empty={isEmpty || undefined}
        data-disabled={isDisabled || undefined}
        data-invalid={isInvalidProp || undefined}
        data-multiple={allowsMultiple || undefined}
        className={clsx(s.base, s[size], textNormal, className)}
      >
        {isEmpty ? (
          renderEmptyState ? (
            renderEmptyState()
          ) : (
            <FileUploadEmpty />
          )
        ) : (
          <>
            <ul
              {...listProps}
              className={clsx(s.list, listClassName)}
              data-multiple={allowsMultiple || undefined}
            >
              <CollectionRoot collection={collection} />
            </ul>
            {allowsMultiple &&
              (renderAddMore ? renderAddMore() : <FileUploadAddMore />)}
          </>
        )}
      </div>
      {overlayTarget && isDropTarget && (
        <FileUploadDropTargetOverlay
          target={overlayTarget}
          isFullscreen={isFullscreen}
        >
          <FileUploadEmpty>
            <FileUploadEmptyIcon />
            <FileUploadEmptyTitle />
          </FileUploadEmpty>
        </FileUploadDropTargetOverlay>
      )}
    </FileUploadContext.Provider>
  );
}

function FileUploadRender<T extends object = object>(
  props: Omit<FileUploadProps<T>, 'ref'>,
  ref?: Ref<HTMLDivElement>
) {
  const { items, children, allowsMultiple = false, ...other } = props;

  return (
    <CollectionBuilder
      content={<Collection items={items}>{children}</Collection>}
    >
      {(collection) => (
        <FileUploadInner
          rootRef={ref}
          collection={collection}
          props={{
            ...other,
            allowsMultiple,
          }}
        />
      )}
    </CollectionBuilder>
  );
}

const FileUploadComponent = forwardRef(FileUploadRender) as FileUploadComponent;

type CompoundedComponent = typeof FileUploadComponent & {
  Empty: typeof FileUploadEmpty;
  EmptyIcon: typeof FileUploadEmptyIcon;
  EmptyTitle: typeof FileUploadEmptyTitle;
  EmptyDescription: typeof FileUploadEmptyDescription;
  AddMore: typeof FileUploadAddMore;
  Trigger: typeof FileUploadTrigger;
  Item: typeof FileUploadItem;
  ItemIcon: typeof FileUploadItemIcon;
  ItemContent: typeof FileUploadItemContent;
  ItemName: typeof FileUploadItemName;
  ItemSize: typeof FileUploadItemSize;
  RemoveButton: typeof FileUploadRemoveButton;
};

/**
 * `FileUpload` lets users pick, display and remove files. It handles
 * selection (system dialog and drag-and-drop), collection rendering and remove
 * intent, but the consumer owns the item data.
 */
export const FileUpload = FileUploadComponent as CompoundedComponent;

FileUpload.Empty = FileUploadEmpty;
FileUpload.EmptyIcon = FileUploadEmptyIcon;
FileUpload.EmptyTitle = FileUploadEmptyTitle;
FileUpload.EmptyDescription = FileUploadEmptyDescription;
FileUpload.AddMore = FileUploadAddMore;
FileUpload.Trigger = FileUploadTrigger;
FileUpload.Item = FileUploadItem;
FileUpload.ItemIcon = FileUploadItemIcon;
FileUpload.ItemContent = FileUploadItemContent;
FileUpload.ItemName = FileUploadItemName;
FileUpload.ItemSize = FileUploadItemSize;
FileUpload.RemoveButton = FileUploadRemoveButton;
