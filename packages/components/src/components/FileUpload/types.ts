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

import type {
  FormFieldErrorProps,
  FormFieldLabelProps,
  FormFieldCaptionProps,
  FormFieldPropLabelAlign,
  FormFieldPropLabelPlacement,
} from '../FormField';
import {
  formFieldPropLabelAlign,
  formFieldPropLabelPlacement,
} from '../FormField';
import type { IconButtonProps } from '../IconButton';

export const fileUploadPropSize = ['default', 'compact'] as const;

export type FileUploadPropSize = (typeof fileUploadPropSize)[number];

export const fileUploadPropLabelPlacement = formFieldPropLabelPlacement;

export type FileUploadPropLabelPlacement = FormFieldPropLabelPlacement;

export const fileUploadPropLabelAlign = formFieldPropLabelAlign;

export type FileUploadPropLabelAlign = FormFieldPropLabelAlign;

export const fileUploadPropAllowed = ['file', 'folder', 'mixed'] as const;

export type FileUploadPropAllowed = (typeof fileUploadPropAllowed)[number];

/** Where files can be dropped: an element ref, or the whole viewport. */
export type FileUploadPropDropzoneTarget =
  | 'fullscreen'
  | RefObject<HTMLElement | null>;

/** Localizable strings used by `FileUpload` (aria labels, size units, captions). */
export type FileUploadMessages = {
  emptyTitle: string;
  listEmptyText: string;
  dropOverlayTitle: string;
  addMoreText: string;
  alternativeSeparator: string;
  browseFile: string;
  browseFiles: string;
  browseFolder: string;
  browseFilesOrFolder: string;
  browseFolderMixed: string;
  removeButtonLabel: string;
  bytesUnit: string;
  kilobytesUnit: string;
  megabytesUnit: string;
  gigabytesUnit: string;
  terabytesUnit: string;
};

export type FileUploadListSlotProps = {
  emptyState?: ComponentPropsWithRef<'div'>;
  fileList?: ComponentPropsWithRef<'div'>;
  addMore?: ComponentPropsWithRef<'div'>;
};

/** A native file with its path relative to the selected or dropped directory. */
export interface FileUploadFile extends File {
  readonly relativePath: string;
}

export type FileUploadProps<T extends object = object> =
  ExtendableComponentPropsWithRef<
    {
      /** The contents of the collection. */
      children: ReactNode | ((item: T) => ReactNode);
      /** Item objects in the collection. */
      items?: Iterable<T>;
      /** Handler called when native files are added via picker or drop. */
      onAdd?: (files: FileUploadFile[]) => void;
      /** Handler called when a remove button requests item removal. */
      onRemove?: (id: Key) => void;
      /** Where files can be dropped: a target element ref or 'fullscreen'. Defaults to the FileUpload root. */
      dropzoneTarget?: FileUploadPropDropzoneTarget;
      /** Custom large empty state renderer. Return `null` to hide the empty state. */
      renderEmptyState?: () => ReactNode;
      /** Overrides localized text used by FileUpload. */
      messages?: Partial<FileUploadMessages>;
      /** The field label. */
      label?: ReactNode;
      /** Helper text displayed below the upload area. */
      caption?: ReactNode;
      /** Validation error displayed when `isInvalid` is true. */
      errorMessage?: ReactNode;
      /** Whether the label is visually hidden. */
      isLabelHidden?: boolean;
      /** Whether the field is marked as required. */
      isRequired?: boolean;
      /**
       * The label's position relative to the upload area.
       * @default 'top'
       */
      labelPlacement?: FileUploadPropLabelPlacement;
      /**
       * The label's horizontal alignment.
       * @default 'start'
       */
      labelAlign?: FileUploadPropLabelAlign;
      /**
       * Whether more than one file can be selected.
       * @default false
       */
      allowsMultiple?: boolean;
      /** Accepted file types (mime types or extensions) for picker and drop. */
      accept?: string[];
      /**
       * Which kind of items can be selected or dropped.
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
        list?: FileUploadListSlotProps;
        dropOverlay?: ComponentPropsWithRef<'div'>;
        label?: FormFieldLabelProps<'span'>;
        caption?: FormFieldCaptionProps;
        errorMessage?: Omit<FormFieldErrorProps, 'children'>;
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

export type FileUploadTriggerProps = {
  /**
   * The contents of the browse link.
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
  'div'
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

export type FileUploadRemoveButtonProps = IconButtonProps;

export type FileUploadComponent = <T extends object = object>(
  props: FileUploadProps<T>
) => ReactElement | null;
