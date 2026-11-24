import type { ComponentPropsWithRef, ReactNode } from 'react';

export const inlineEditPropMode = ['view', 'edit'] as const;
export type InlineEditPropMode = (typeof inlineEditPropMode)[number];

export type InlineEditRenderEditProps<T> = {
  value: T;
  onChange(value: T): void;
  /** Saves the current draft, or the supplied value when selection changes first. */
  commit(value?: T): void;
};

export type InlineEditProps<T> = Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'defaultValue' | 'onChange'
> & {
  /** Controlled value. */
  value?: T;
  /** Initial uncontrolled value. */
  defaultValue?: T;
  /** Called when the editor changes or cancel restores the snapshot. */
  onChange?: (value: T) => void;
  /** Controlled mode. */
  mode?: InlineEditPropMode;
  /**
   * Initial uncontrolled mode.
   * @default 'view'
   */
  defaultMode?: InlineEditPropMode;
  /** Called on every requested mode transition. */
  onModeChange?: (mode: InlineEditPropMode) => void;
  /** Label rendered above the value. */
  label?: ReactNode;
  /** Renders the current value in view mode. */
  renderView: (value: T) => ReactNode;
  /** Renders the editor inside the edit overlay. */
  renderEdit: (props: InlineEditRenderEditProps<T>) => ReactNode;
  /**
   * Prevents user interaction from opening the editor.
   * @default false
   */
  isDisabled?: boolean;
  /** Fixed overlay width in pixels. By default the anchor width is used. */
  editModeWidth?: number;
  /** Called after a local save. */
  onSaved?: (value: T) => void;
  /** Called after cancel restores the opening value. */
  onCanceled?: () => void;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
};
