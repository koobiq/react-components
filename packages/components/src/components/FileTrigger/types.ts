import type { ReactNode, ComponentRef } from 'react';

export const fileTriggerPropDefaultCamera = ['user', 'environment'] as const;

export type FileTriggerPropDefaultCamera =
  (typeof fileTriggerPropDefaultCamera)[number];

export type FileTriggerProps = {
  /**
   * The trigger that opens the file dialog. Any pressable component works
   * out of the box: `Button`, `IconButton`, `Link`.
   */
  children: ReactNode;
  /** Handler that is called when a user selects files in the dialog. */
  onSelect?: (files: FileList | null) => void;
  /**
   * The file types the dialog offers, for example `['image/*', '.pdf']`.
   * The browser only filters the dialog, it does not validate the result.
   */
  accept?: readonly string[];
  /**
   * Whether more than one file can be selected.
   * @default false
   */
  allowsMultiple?: boolean;
  /**
   * Whether a directory is selected instead of individual files.
   * @default false
   */
  acceptDirectory?: boolean;
  /** Which camera the capture mechanism uses. Mobile browsers only. */
  defaultCamera?: FileTriggerPropDefaultCamera;
  /** Unique identifier for testing purposes. Set on the hidden file input. */
  'data-testid'?: string | number;
};

/** The component forwards the ref to the underlying hidden file input. */
export type FileTriggerRef = ComponentRef<'input'>;
