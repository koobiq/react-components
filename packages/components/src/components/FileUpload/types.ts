import type {
  Ref,
  ReactNode,
  ComponentRef,
  CSSProperties,
  ComponentPropsWithRef,
} from 'react';

import type { Key, ExtendableProps } from '@koobiq/react-core';

export const fileUploadPropSize = ['default', 'compact'] as const;

export type FileUploadPropSize = (typeof fileUploadPropSize)[number];

export const fileUploadPropAllowed = ['file', 'folder', 'mixed'] as const;

export type FileUploadPropAllowed = (typeof fileUploadPropAllowed)[number];

export const fileUploadPropDirectoryMode = ['as-item', 'contents'] as const;

export type FileUploadPropDirectoryMode =
  (typeof fileUploadPropDirectoryMode)[number];

/**
 * A single entry in the file upload list.
 *
 * The component owns `id`/`file` and derives display values from the native
 * `File`. The consumer drives `isLoading`/`progress`/`errorMessage` from the
 * outside — `FileUpload` never uploads anything itself.
 */
export type FileUploadItem = {
  /** Stable unique key, generated when a file is added. */
  id: Key;
  /** The native File — the source of `name`/`size`/`type` by default. */
  file: File;
  /** Overrides the displayed name (defaults to `file.name`). */
  name?: string;
  /** Overrides the displayed size in bytes (defaults to `file.size`). */
  size?: number;
  /** Whether the entry represents a folder (affects the default icon). */
  type?: 'file' | 'folder';
  /** Show the loading spinner (spec "Загрузка/Progress"). Consumer-driven. */
  isLoading?: boolean;
  /** Determinate progress `0..100`; `undefined` while loading = indeterminate. */
  progress?: number;
  /** Per-item error message — puts the row into the Invalid state. */
  errorMessage?: ReactNode;
  /** Custom icon for the row (e.g. an image thumbnail). */
  icon?: ReactNode;
  /** Whether this row is disabled. */
  isDisabled?: boolean;
};

/** Localizable strings used by `FileUpload` (aria labels, size units, captions). */
export type FileUploadMessages = {
  dropHere: string;
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

type FileUploadBaseProps = {
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
  /** The selected files (controlled). */
  value?: FileUploadItem[];
  /** The initial selected files (uncontrolled). */
  defaultValue?: FileUploadItem[];
  /** Handler called whenever the list changes (add or remove). */
  onChange?: (items: FileUploadItem[]) => void;
  /** Handler called when files are added. */
  onAdd?: (added: FileUploadItem[], all: FileUploadItem[]) => void;
  /** Handler called when a file is removed. */
  onRemove?: (
    removed: FileUploadItem,
    index: number,
    all: FileUploadItem[]
  ) => void;
  /**
   * The layout size.
   * @default 'default'
   */
  size?: FileUploadPropSize;
  /** Whether to show the file size in the list (defaults to `allowsMultiple`). */
  showFileSize?: boolean;
  /** Whether the whole component is disabled. */
  isDisabled?: boolean;
  /** Composition of `FileUpload.*` parts. Falls back to the default layout. */
  children?: ReactNode;
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
  /** Ref to the root element. */
  ref?: Ref<HTMLDivElement>;
};

export type FileUploadProps = ExtendableProps<
  FileUploadBaseProps,
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

export type FileUploadDropzoneProps = ExtendableProps<
  FileUploadSlotBaseProps<'div'>,
  object
>;

export type FileUploadListProps = ExtendableProps<
  FileUploadSlotBaseProps<'ul'>,
  object
>;

export type FileUploadTriggerProps = {
  /** The visible label of the browse link. Defaults to a localized string. */
  children?: ReactNode;
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
};

export type FileUploadItemProps = {
  /** The item to render. */
  item: FileUploadItem;
  /** Custom content, overrides the default name rendering. */
  children?: ReactNode;
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
};
