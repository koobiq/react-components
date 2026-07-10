import type {
  Ref,
  ReactNode,
  ComponentRef,
  CSSProperties,
  ReactElement,
  ComponentPropsWithRef,
} from 'react';

import type {
  Key,
  ExtendableProps,
  DataAttributeProps,
} from '@koobiq/react-core';

import type { IconButtonProps } from '../IconButton';

export const fileUploadPropSize = ['default', 'compact'] as const;

export type FileUploadPropSize = (typeof fileUploadPropSize)[number];

export const fileUploadPropAllowed = ['file', 'folder', 'mixed'] as const;

export type FileUploadPropAllowed = (typeof fileUploadPropAllowed)[number];

export const fileUploadPropDirectoryMode = ['as-item', 'contents'] as const;

export type FileUploadPropDirectoryMode =
  (typeof fileUploadPropDirectoryMode)[number];

/** Localizable strings used by `FileUpload` (aria labels, size units, captions). */
export type FileUploadMessages = {
  dropHere: string;
  dropTitle: string;
  or: string;
  browseFile: string;
  browseFiles: string;
  browseFolder: string;
  browseFilesOrFolder: string;
  addMore: string;
  removeButtonLabel: string;
  uploadingLabel: string;
  bytes: string;
  kilobytes: string;
  megabytes: string;
  gigabytes: string;
  terabytes: string;
};

type FileUploadDOMProps = Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'defaultValue' | 'onChange' | 'ref'
>;

type FileUploadListSlotProps = Omit<ComponentPropsWithRef<'ul'>, 'children'> &
  DataAttributeProps;

type FileUploadBaseProps<T extends object> = {
  /** The contents of the collection. */
  children: ReactNode | ((item: T) => ReactNode);
  /** Item objects in the collection. */
  items?: Iterable<T>;
  /** Handler called when native files are added via picker or drop. */
  onAdd?: (files: File[]) => void;
  /** Handler called when a remove button requests item removal. */
  onRemove?: (id: Key) => void;
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
   * When a folder is selected, add it as a single item or expand its contents.
   * @default 'as-item'
   */
  directoryMode?: FileUploadPropDirectoryMode;
  /**
   * The layout size.
   * @default 'default'
   */
  size?: FileUploadPropSize;
  /** Whether the whole component is disabled. */
  isDisabled?: boolean;
  /** Whether the whole component is in the invalid state. */
  isInvalid?: boolean;
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** Props applied to internal parts of FileUpload. */
  slotProps?: {
    /** Props applied to the collection list element. */
    list?: FileUploadListSlotProps;
  };
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
  /** Ref to the root element. */
  ref?: Ref<HTMLDivElement>;
};

export type FileUploadProps<T extends object = object> = ExtendableProps<
  FileUploadBaseProps<T>,
  FileUploadDOMProps
>;

export type FileUploadRef = ComponentRef<'div'>;

type FileUploadSlotBaseProps<T extends keyof HTMLElementTagNameMap> = {
  /** The content of the component. */
  children?: ReactNode;
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
} & Omit<ComponentPropsWithRef<T>, 'children'>;

export type FileUploadEmptyProps = ExtendableProps<
  FileUploadSlotBaseProps<'div'>,
  object
>;

export type FileUploadEmptyIconProps = ExtendableProps<
  FileUploadSlotBaseProps<'span'>,
  object
>;

export type FileUploadEmptyTitleProps = ExtendableProps<
  FileUploadSlotBaseProps<'span'>,
  object
>;

export type FileUploadEmptyDescriptionProps = ExtendableProps<
  FileUploadSlotBaseProps<'span'>,
  object
>;

export type FileUploadAddMoreProps = ExtendableProps<
  FileUploadSlotBaseProps<'div'>,
  object
>;

export type FileUploadTriggerProps = {
  /**
   * The visible label of the default browse link, or a custom pressable
   * component. Defaults to a localized string rendered as a link.
   */
  children?: ReactNode;
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
};

export type FileUploadItemProps = ExtendableProps<
  Omit<FileUploadSlotBaseProps<'li'>, 'id'> & {
    /** Stable unique key of this item. */
    id?: Key;
    /** Text used by collection accessibility and the remove button label. */
    textValue?: string;
    /** Whether this row is disabled. */
    isDisabled?: boolean;
    /** Whether this row is invalid. */
    isInvalid?: boolean;
  },
  object
>;

export type FileUploadItemIconProps = ExtendableProps<
  FileUploadSlotBaseProps<'span'>,
  object
>;

export type FileUploadItemContentProps = ExtendableProps<
  FileUploadSlotBaseProps<'span'>,
  object
>;

export type FileUploadItemNameProps = ExtendableProps<
  FileUploadSlotBaseProps<'span'>,
  object
>;

export type FileUploadItemSizeProps = ExtendableProps<
  Omit<FileUploadSlotBaseProps<'span'>, 'children'> & {
    children?: ReactNode | number;
  },
  object
>;

export type FileUploadRemoveButtonProps = Omit<IconButtonProps, 'children'>;

export type FileUploadComponent = <T extends object = object>(
  props: FileUploadProps<T> & { ref?: Ref<FileUploadRef> }
) => ReactElement | null;
