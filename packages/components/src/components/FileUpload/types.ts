import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  FocusEventHandler,
  ReactNode,
  Ref,
} from 'react';

import type { ExtendableProps } from '@koobiq/react-core';

/** A single file tracked by an upload component. */
export interface FileItem {
  /** The underlying native file. */
  file: File;
  /** Whether this file is in an error state (drives per-row error styling). */
  hasError?: boolean;
  /** Whether this file is currently loading; replaces its icon with a progress indicator. */
  loading?: boolean;
  /** Upload progress in the range 0–100 (used while `loading` is `true` in determinate mode). */
  progress?: number;
}

/** A native file stamped with its full path within a dropped directory tree. */
export type FileWithPath = File & { fullPath: string };

/** The kinds of items an upload component accepts. */
export const fileUploadAllowedType = ['file', 'folder', 'mixed'] as const;

export type FileUploadAllowedType = (typeof fileUploadAllowedType)[number];

/** Progress indicator mode. */
export const fileUploadProgressMode = ['determinate', 'indeterminate'] as const;

export type FileUploadProgressMode = (typeof fileUploadProgressMode)[number];

/** Density of the multiple-file empty state. */
export const multipleFileUploadSize = ['default', 'compact'] as const;

export type MultipleFileUploadSize = (typeof multipleFileUploadSize)[number];

/** Visual size of dropzone content. */
export const dropzoneContentSize = ['compact', 'normal', 'big'] as const;

export type DropzoneContentSize = (typeof dropzoneContentSize)[number];

/** Configuration for a dropzone overlay (used by the Phase 2 dropzone components). */
export interface DropzoneData {
  /** Title text; falls back to a localized default. */
  title?: string;
  /** Caption text or node rendered below the title. */
  caption?: ReactNode;
  /** Visual size of the dropzone content. */
  size?: DropzoneContentSize;
  /** Whether focus is captured automatically when the overlay opens. @default true */
  autoCapture?: boolean;
}

/** State passed to error-visibility predicates. */
export interface FileUploadState {
  /** Whether the control is invalid. */
  isInvalid: boolean;
  /** Whether the control has been blurred/interacted with. */
  isTouched: boolean;
  /** Whether the value has changed since mount. */
  isDirty: boolean;
  /** Whether the surrounding form has been submitted. */
  isSubmitted: boolean;
}

/** Predicate deciding whether error styling should be shown. */
export type ShouldShowError = (state: FileUploadState) => boolean;

/** Locale strings for the single-file upload. */
export interface SingleFileUploadLocaleConfig {
  captionText: string;
  captionTextOnlyFolder: string;
  captionTextWithFolder: string;
  browseLink: string;
  browseLinkFolder: string;
  browseLinkFolderMixed?: string;
}

/** Locale strings for the multiple-file upload. */
export interface MultipleFileUploadLocaleConfig extends SingleFileUploadLocaleConfig {
  captionTextWhenSelected: string;
  captionTextForCompactSize: string;
  title: string;
}

/** Combined single + multiple locale configuration. */
export interface FileUploadLocaleConfig {
  single: SingleFileUploadLocaleConfig;
  multiple: MultipleFileUploadLocaleConfig;
}

/** Resolved caption pieces used to render an empty-state caption. */
export interface FileUploadCaptionContext {
  /** Leading caption text. */
  captionText: string;
  /** Label for the file browse link. */
  browseLink?: string;
  /** Text placed between the file and folder browse links. */
  captionTextSeparator?: string;
  /** Label for the folder browse link. */
  browseLinkFolder?: string;
}

/** Error produced by the {@link maxFileSize} validator. */
export interface MaxFileSizeError {
  maxFileSize: { max: number; actual: number };
}

/** Error produced by the {@link isCorrectExtension} validator. */
export interface FileExtensionMismatchError {
  fileExtensionMismatch: { expected: string[]; actual: string };
}

/** Overrides for the composite parts of an upload component. */
export interface FileUploadSlotProps {
  /** Props for the bordered drop area. */
  dropArea?: ComponentPropsWithoutRef<'div'>;
}

/**
 * Imperative handle exposed by the upload components (via `dropTargetRef`) so a
 * `LocalDropzone` can route dropped files into them.
 */
export interface FileUploadDropTarget {
  /** Adds files to the connected component (single takes the first). */
  addFiles: (files: FileWithPath[]) => void;
}

type FileUploadSharedProps = {
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
  /**
   * Native-input `accept` specifiers. Forwarded to the file input as a browse
   * hint only — it is NOT enforced on drop (validation is the app's job).
   */
  accept?: string[];
  /**
   * Which item kinds the component accepts.
   * @default 'file'
   */
  allowed?: FileUploadAllowedType;
  /**
   * If `true`, the component is disabled.
   */
  isDisabled?: boolean;
  /**
   * If `true`, the component is in an invalid state.
   */
  isInvalid?: boolean;
  /**
   * Predicate controlling when the invalid styling is shown.
   * @default showErrorOnTouched
   */
  shouldShowError?: ShouldShowError;
  /**
   * Progress indicator mode.
   * @default 'determinate'
   */
  progressMode?: FileUploadProgressMode;
  /** Id for the underlying file input; auto-generated when omitted. */
  inputId?: string;
  /** Blur handler; marks the control as touched. */
  onBlur?: FocusEventHandler<HTMLDivElement>;
  /** Error message rendered below the control when invalid. */
  errorMessage?: ReactNode;
  /** Helper text rendered below the control. */
  caption?: ReactNode;
  /** Overrides for composite parts. */
  slotProps?: FileUploadSlotProps;
  /**
   * Opt-in full-screen dropzone. Pass `true` to enable with defaults, or a
   * {@link DropzoneData} object to configure it. While active, the inline drop
   * area is disabled and a full-viewport overlay opens on document drag.
   */
  fullScreenDropzone?: boolean | DropzoneData;
  /**
   * Imperative handle populated with an `addFiles` method, so a
   * `LocalDropzone` can be connected to this component.
   */
  dropTargetRef?: Ref<FileUploadDropTarget>;
  /**
   * If `true`, the component is disabled.
   * @deprecated The "disabled" prop is deprecated. Use "isDisabled" prop to replace it.
   */
  disabled?: boolean;
};

type SingleFileUploadOwnProps = FileUploadSharedProps & {
  /** Controlled value (holds at most one file). */
  value?: FileItem | null;
  /**
   * Uncontrolled initial value.
   * @default null
   */
  defaultValue?: FileItem | null;
  /** Fires when the value changes (pick, drop, remove, programmatic write). */
  onChange?: (value: FileItem | null) => void;
  /** Fires when a file is added. */
  onFilesAdded?: (added: FileItem) => void;
  /** Fires when the file is removed. */
  onFileRemoved?: (removed: FileItem) => void;
  /**
   * Whether to display the file size.
   * @default true
   */
  showFileSize?: boolean;
  /** Locale overrides (highest precedence). */
  localeConfig?: Partial<SingleFileUploadLocaleConfig>;
  /** Custom leading icon for the selected-file row. */
  icon?: ReactNode;
};

export type SingleFileUploadProps = ExtendableProps<
  SingleFileUploadOwnProps,
  Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'defaultValue' | 'color'>
>;

type MultipleFileUploadOwnProps = FileUploadSharedProps & {
  /** Controlled value (an ordered list of files). */
  value?: FileItem[];
  /**
   * Uncontrolled initial value.
   * @default []
   */
  defaultValue?: FileItem[];
  /** Fires when the value changes (pick, drop, remove, programmatic write). */
  onChange?: (value: FileItem[]) => void;
  /** Fires with the chunk of files that were just added. */
  onFilesAdded?: (added: FileItem[]) => void;
  /** Fires with the removed file and its index. */
  onFileRemoved?: (removed: FileItem, index: number) => void;
  /**
   * Empty-state density.
   * @default 'default'
   */
  size?: MultipleFileUploadSize;
  /** Renders a custom leading icon per row. */
  renderFileIcon?: (item: FileItem) => ReactNode;
  /** Locale overrides (highest precedence). */
  localeConfig?: Partial<MultipleFileUploadLocaleConfig>;
};

export type MultipleFileUploadProps = ExtendableProps<
  MultipleFileUploadOwnProps,
  Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'defaultValue' | 'color'>
>;
