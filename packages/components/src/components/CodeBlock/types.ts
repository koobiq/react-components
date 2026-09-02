import type {
  ComponentPropsWithRef,
  CSSProperties,
  ReactNode,
  Ref,
} from 'react';

import type { DataAttributeProps } from '@koobiq/react-core';

/** A single file displayed inside a `CodeBlock`. */
export type CodeBlockFile = {
  /** Code content. */
  content: string;
  /**
   * File name, displayed in the tab header and used when downloading.
   * If not provided, `fallbackFileName` is used instead.
   */
  filename?: string;
  /**
   * File language, required for correct syntax highlighting.
   * If not provided or unsupported, falls back to `plaintext`.
   *
   * List of supported languages: {@link https://highlightjs.readthedocs.io/en/stable/supported-languages.html}
   */
  language?: string;
  /**
   * Link to the file, opened in a new tab.
   * Adds the "open in external system" action.
   */
  link?: string;
};

/** Options to scroll the code content to a given position. */
export type CodeBlockScrollToOptions = ScrollOptions & {
  /** Offset from the top edge. */
  top?: number;
  /** Offset from the bottom edge. */
  bottom?: number;
  /** Offset from the left edge. */
  left?: number;
  /** Offset from the right edge. */
  right?: number;
  /** Offset from the inline-start edge. */
  start?: number;
  /** Offset from the inline-end edge. */
  end?: number;
};

/** Imperative handle exposed on the `CodeBlock` ref. */
export type CodeBlockRef = {
  /** The root DOM element. */
  element: HTMLDivElement | null;
  /** Scrolls the code content to the specified position. */
  scrollTo: (options: CodeBlockScrollToOptions) => void;
};

export type CodeBlockProps = {
  /** Files to display. */
  files: CodeBlockFile[];
  /**
   * Whether to display line numbers.
   * @default false
   */
  hasLineNumbers?: boolean;
  /**
   * Whether the code block should be filled instead of outlined.
   * @default false
   */
  isFilled?: boolean;
  /**
   * Whether to hide the border.
   * @default false
   */
  hideBorder?: boolean;
  /**
   * Adds a soft-wrap toggle button to the action bar.
   * @default false
   */
  canToggleSoftWrap?: boolean;
  /**
   * Adds a download-file button to the action bar.
   * @default false
   */
  canDownload?: boolean;
  /**
   * Whether to hide the copy-to-clipboard button.
   * @default false
   */
  hideCopyButton?: boolean;
  /**
   * Whether the action bar should remain visible when tabs are hidden.
   * @default false
   */
  alwaysShowActionBar?: boolean;
  /**
   * Whether sequences of whitespace are preserved instead of wrapping.
   * @default false
   */
  softWrap?: boolean;
  /** The uncontrolled default value for `softWrap`. */
  defaultSoftWrap?: boolean;
  /** Handler called when the soft-wrap mode changes. */
  onSoftWrapChange?: (softWrap: boolean) => void;
  /**
   * Whether the full content is shown regardless of `maxHeight`.
   * @default false
   */
  viewAll?: boolean;
  /** The uncontrolled default value for `viewAll`. */
  defaultViewAll?: boolean;
  /** Handler called when `viewAll` changes. */
  onViewAllChange?: (viewAll: boolean) => void;
  /**
   * Maximum height (in pixels) of the code block content, in which case the rest is hidden.
   * Can be toggled open with `viewAll`.
   */
  maxHeight?: number;
  /**
   * Whether to hide the header tabs, which also makes the action bar floating and shown on hover only.
   *
   * When the prop is omitted, the component decides on its own: the header is hidden for a single file
   * without a `filename` and shown otherwise. Passing `false` takes that decision over and keeps the
   * header visible even for such a file.
   */
  hideTabs?: boolean;
  /** The uncontrolled default value for `hideTabs`. */
  defaultHideTabs?: boolean;
  /** Handler called when `hideTabs` changes. */
  onHideTabsChange?: (hideTabs: boolean) => void;
  /**
   * The index of the active file.
   * @default 0
   */
  activeFileIndex?: number;
  /** The uncontrolled default value for `activeFileIndex`. */
  defaultActiveFileIndex?: number;
  /** Handler called when the active file index changes. */
  onActiveFileIndexChange?: (activeFileIndex: number) => void;
  /** Renders custom tab label content instead of the plain file name. */
  renderTabLabel?: (file: CodeBlockFile, fallbackFileName: string) => ReactNode;
  /**
   * Fallback file name used when a file has no `filename`, both for the tab label and for downloads.
   * @default 'code'
   */
  fallbackFileName?: string;
  /** The starting line number. */
  startFrom?: number;
  /** The props used for each slot inside. */
  slotProps?: {
    /** Props of the header holding the tabs. */
    header?: Omit<ComponentPropsWithRef<'div'>, 'children'>;
    /** Props of the scrollable region holding the code. */
    content?: Omit<ComponentPropsWithRef<'div'>, 'children'>;
  };
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** Ref to the root element, also exposing the `scrollTo` method. */
  ref?: Ref<CodeBlockRef>;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
} & DataAttributeProps;
