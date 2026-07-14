'use client';

import type { Ref, ReactNode } from 'react';
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
  mergeProps,
  useDOMRef,
  useKeyedRefs,
  useNumberFormatter,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';
import {
  Collection,
  Provider,
  TextContext,
  DEFAULT_SLOT,
  CollectionBuilder,
  FieldErrorContext,
  CollectionRendererContext,
} from '@koobiq/react-primitives';

import { formatFileSize } from '../../utils';
import type {
  FormFieldProps,
  FormFieldErrorProps,
  FormFieldLabelProps,
  FormFieldCaptionProps,
} from '../FormField';
import { FormField } from '../FormField';

import {
  FileUploadAddMore,
  FileUploadControl,
  FileUploadEmpty,
  FileUploadEmptyIcon,
  FileUploadEmptyTitle,
  FileUploadItem,
  FileUploadItemContent,
  FileUploadItemIcon,
  FileUploadItemName,
  FileUploadItemSize,
  FileUploadListEmpty,
  FileUploadRemoveButton,
  FileUploadTrigger,
  FileUploadEmptyDescription,
} from './components';
import { FileUploadDropTargetOverlay } from './components/DropTargetOverlay';
import s from './FileUpload.module.css';
import type { FileUploadContextValue } from './FileUploadContext';
import { FileUploadContext } from './FileUploadContext';
import { useFileDropTarget, useFileUploadField } from './hooks';
import intlMessages from './intl';
import type {
  FileUploadComponent,
  FileUploadMessages,
  FileUploadProps,
} from './types';
import { prepareFileUploadFiles } from './utils';

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
    label,
    caption,
    errorMessage,
    isLabelHidden,
    isRequired = false,
    labelPlacement,
    labelAlign,
    id,
    role,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'aria-details': ariaDetails,
    'aria-errormessage': ariaErrorMessage,
    messages: messageOverrides,
    renderEmptyState,
    'data-testid': testId,
    ...other
  } = props;

  const domRef = useDOMRef<HTMLDivElement>(rootRef);
  const controlRef = useRef<HTMLDivElement>(null);
  const { CollectionRoot } = useContext(CollectionRendererContext);

  const isEmpty = collection.size === 0;

  const collectionKeys = useMemo(
    () => getCollectionKeys(collection),
    [collection]
  );

  const stringFormatter = useLocalizedStringFormatter(intlMessages);
  const numberFormatter = useNumberFormatter({ maximumFractionDigits: 2 });

  const field = useFileUploadField({
    id,
    role,
    label,
    caption,
    hasErrorMessage: errorMessage != null,
    isDisabled,
    isInvalid: isInvalidProp,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'aria-details': ariaDetails,
    'aria-errormessage': ariaErrorMessage,
  });

  const labelProps = mergeProps<(FormFieldLabelProps<'span'> | undefined)[]>(
    {
      as: 'span',
      children: label,
      isHidden: isLabelHidden,
      isRequired,
    },
    slotProps?.label,
    field.labelProps
  );

  const captionProps = mergeProps<(FormFieldCaptionProps | undefined)[]>(
    { children: caption },
    slotProps?.caption
  );

  const errorMessageProps = mergeProps<(FormFieldErrorProps | undefined)[]>(
    { children: errorMessage },
    slotProps?.errorMessage
  );

  const messages = useMemo<FileUploadMessages>(() => {
    const localizedMessages = {
      emptyTitle: stringFormatter.format('emptyTitle'),
      listEmptyText: stringFormatter.format('listEmptyText'),
      dropOverlayTitle: stringFormatter.format('dropOverlayTitle'),
      addMoreText: stringFormatter.format('addMoreText'),
      alternativeSeparator: stringFormatter.format('alternativeSeparator'),
      browseFile: stringFormatter.format('browseFile'),
      browseFiles: stringFormatter.format('browseFiles'),
      browseFolder: stringFormatter.format('browseFolder'),
      browseFilesOrFolder: stringFormatter.format('browseFilesOrFolder'),
      browseFolderMixed: stringFormatter.format('browseFolderMixed'),
      removeButtonLabel: stringFormatter.format('removeButtonLabel'),
      bytesUnit: stringFormatter.format('bytesUnit'),
      kilobytesUnit: stringFormatter.format('kilobytesUnit'),
      megabytesUnit: stringFormatter.format('megabytesUnit'),
      gigabytesUnit: stringFormatter.format('gigabytesUnit'),
      terabytesUnit: stringFormatter.format('terabytesUnit'),
    };

    return { ...localizedMessages, ...messageOverrides };
  }, [stringFormatter, messageOverrides]);

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
          B: messages.bytesUnit,
          KB: messages.kilobytesUnit,
          MB: messages.megabytesUnit,
          GB: messages.gigabytesUnit,
          TB: messages.terabytesUnit,
        },
      }),
    [numberFormatter, messages]
  );

  const addFiles = useCallback(
    (files: File[]) => {
      if (isDisabled || files.length === 0) return;

      const preparedFiles = prepareFileUploadFiles(files, {
        accept,
        allowed,
        allowsMultiple,
      });

      if (preparedFiles.length > 0) onAdd?.(preparedFiles);
    },
    [accept, allowed, isDisabled, allowsMultiple, onAdd]
  );

  const isFullscreen = dropzoneTarget === 'fullscreen';

  const dropRef =
    dropzoneTarget && dropzoneTarget !== 'fullscreen'
      ? dropzoneTarget
      : controlRef;

  const isDropTarget = useFileDropTarget({
    ref: dropRef,
    isFullscreen,
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

  const showsLargeEmpty =
    isEmpty &&
    allowsMultiple &&
    size === 'default' &&
    dropzoneTarget === undefined;

  const rootProps = mergeProps<(FormFieldProps | undefined)[]>(other, {
    ref: domRef,
    fullWidth: true,
    style,
    labelPlacement,
    labelAlign,
    'data-size': size,
    'data-empty': isEmpty || undefined,
    'data-list-empty': (isEmpty && !showsLargeEmpty) || undefined,
    'data-disabled': isDisabled || undefined,
    'data-invalid': isInvalidProp || undefined,
    'data-multiple': allowsMultiple || undefined,
    'data-required': isRequired || undefined,
    'data-testid': testId,
    className: clsx(s.base, className),
  });

  const overlayTarget = isFullscreen
    ? (domRef.current?.ownerDocument.documentElement ?? null)
    : (dropzoneTarget?.current ?? null);

  let uploadContent: ReactNode;

  if (!isEmpty) {
    uploadContent = (
      <>
        <div
          {...listProps}
          className={clsx(s.list, listClassName)}
          data-multiple={allowsMultiple || undefined}
          data-size={size}
        >
          <CollectionRoot collection={collection} />
        </div>
        {allowsMultiple && <FileUploadAddMore {...slotProps?.addMore} />}
      </>
    );
  } else if (showsLargeEmpty) {
    uploadContent = renderEmptyState ? renderEmptyState() : <FileUploadEmpty />;
  } else {
    uploadContent = <FileUploadListEmpty {...slotProps?.listEmpty} />;
  }

  return (
    <FileUploadContext.Provider value={contextValue}>
      <FormField {...rootProps}>
        <FormField.Label {...labelProps} />
        <div className={s.body}>
          <FileUploadControl {...field.controlProps} ref={controlRef}>
            {uploadContent}
          </FileUploadControl>
          <Provider
            values={[
              [
                TextContext,
                {
                  slots: {
                    [DEFAULT_SLOT]: {},
                    description: field.descriptionProps,
                    errorMessage: field.errorMessageProps,
                  },
                },
              ],
              [FieldErrorContext, field.validation],
            ]}
          >
            <FormField.Error {...errorMessageProps} />
            <FormField.Caption {...captionProps} />
          </Provider>
        </div>
      </FormField>
      {overlayTarget && isDropTarget && (
        <FileUploadDropTargetOverlay
          {...slotProps?.dropOverlay}
          target={overlayTarget}
          isFullscreen={isFullscreen}
        >
          <FileUploadEmpty>
            <FileUploadEmptyIcon />
            <FileUploadEmptyTitle>
              {messages.dropOverlayTitle}
            </FileUploadEmptyTitle>
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
FileUpload.Trigger = FileUploadTrigger;
FileUpload.Item = FileUploadItem;
FileUpload.ItemIcon = FileUploadItemIcon;
FileUpload.ItemContent = FileUploadItemContent;
FileUpload.ItemName = FileUploadItemName;
FileUpload.ItemSize = FileUploadItemSize;
FileUpload.RemoveButton = FileUploadRemoveButton;
