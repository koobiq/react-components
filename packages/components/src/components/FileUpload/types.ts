import type {
  RefObject,
  ReactNode,
  ComponentRef,
  CSSProperties,
  ReactElement,
  ComponentPropsWithRef,
} from 'react';

import type {
  Key,
  DataAttributeProps,
  ExtendableComponentPropsWithRef,
} from '@koobiq/react-core';

import type { IconButtonProps } from '../IconButton';

export const fileUploadPropSize = ['default', 'compact'] as const;

export type FileUploadPropSize = (typeof fileUploadPropSize)[number];

export const fileUploadPropAllowed = ['file', 'folder', 'mixed'] as const;

export type FileUploadPropAllowed = (typeof fileUploadPropAllowed)[number];

/** Where files can be dropped: an element ref, or the whole viewport. */
export type FileUploadPropDropzoneTarget =
  | 'fullscreen'
  | RefObject<HTMLElement | null>;

/** Localizable strings used by `FileUpload` (aria labels, size units, captions). */
export type FileUploadMessages = {
  dropHere: string;
  dropTitle: string;
  or: string;
  browseFile: string;
  browseFiles: string;
  browseFolder: string;
  browseFilesOrFolder: string;
  browseFolderMixed: string;
  addMore: string;
  removeButtonLabel: string;
  uploadingLabel: string;
  bytes: string;
  kilobytes: string;
  megabytes: string;
  gigabytes: string;
  terabytes: string;
};

export type FileUploadProps<T extends object = object> =
  ExtendableComponentPropsWithRef<
    {
      /** The contents of the collection. */
      children: ReactNode | ((item: T) => ReactNode);
      /** Item objects in the collection. */
      items?: Iterable<T>;
      /** Handler called when native files are added via picker or drop. */
      onAdd?: (files: File[]) => void;
      /** Handler called when a remove button requests item removal. */
      onRemove?: (id: Key) => void;
      /** Where files can be dropped: a target element ref or 'fullscreen'. Defaults to the FileUpload root. */
      dropzoneTarget?: FileUploadPropDropzoneTarget;
      /** Custom empty state renderer. Return `null` to hide the empty state. */
      renderEmptyState?: () => ReactNode;
      /** Custom add-more renderer shown after items. Return `null` to hide it. */
      renderAddMore?: () => ReactNode;
      /**
       * Whether more than one file can be selected.
       * @default false
       */
      allowsMultiple?: boolean;
      /** Accepted file types (mime types or extensions). */
      accept?: string[];
      /**
       * Which kind of items can be selected.
       * @default 'file'
       */
      allowed?: FileUploadPropAllowed;
      /**
       * The layout size.
       * @default 'default'
       */
      size?: FileUploadPropSize;
      /** Whether the whole component is disabled. */
      isDisabled?: boolean;
      /** Whether the whole component is in the invalid state. */
      isInvalid?: boolean;
      /** Props applied to internal parts of FileUpload. */
      slotProps?: {
        list?: ComponentPropsWithRef<'ul'> & DataAttributeProps;
      };
      /** Unique identifier for testing purposes. */
      'data-testid'?: string | number;
    },
    'div'
  >;

export type FileUploadRef = ComponentRef<'div'>;

export type FileUploadEmptyProps = ExtendableComponentPropsWithRef<
  DataAttributeProps,
  'div'
>;

export type FileUploadEmptyIconProps = ExtendableComponentPropsWithRef<
  DataAttributeProps,
  'span'
>;

export type FileUploadEmptyTitleProps = ExtendableComponentPropsWithRef<
  DataAttributeProps,
  'span'
>;

export type FileUploadEmptyDescriptionProps = ExtendableComponentPropsWithRef<
  DataAttributeProps,
  'span'
>;

export type FileUploadAddMoreProps = ExtendableComponentPropsWithRef<
  DataAttributeProps,
  'div'
>;

export type FileUploadTriggerProps = {
  /**
   * The visible label of the default browse link, or a custom pressable
   * component. Defaults to a localized string rendered as a link.
   */
  children?: ReactNode;
  /**
   * Open the folder picker (`webkitdirectory`) instead of the file picker.
   * @default allowed === 'folder'
   */
  acceptDirectory?: boolean;
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
};

export type FileUploadItemProps = ExtendableComponentPropsWithRef<
  {
    /** Stable unique key of this item. */
    id?: Key;
    /** Text used by collection accessibility and the remove button label. */
    textValue?: string;
    /** Whether this row is disabled. */
    isDisabled?: boolean;
    /** Whether this row is invalid. */
    isInvalid?: boolean;
  } & DataAttributeProps,
  'li'
>;

export type FileUploadItemIconProps = ExtendableComponentPropsWithRef<
  DataAttributeProps,
  'span'
>;

export type FileUploadItemContentProps = ExtendableComponentPropsWithRef<
  DataAttributeProps,
  'span'
>;

export type FileUploadItemNameProps = ExtendableComponentPropsWithRef<
  DataAttributeProps,
  'span'
>;

export type FileUploadItemSizeProps = ExtendableComponentPropsWithRef<
  DataAttributeProps,
  'span'
>;

export type FileUploadRemoveButtonProps = Omit<IconButtonProps, 'children'>;

export type FileUploadComponent = <T extends object = object>(
  props: FileUploadProps<T>
) => ReactElement | null;
