import type { ComponentPropsWithRef, ReactNode } from 'react';

import type { TooltipPropPlacement } from '../Tooltip';

export const inlineEditPropMode = ['view', 'edit'] as const;
export type InlineEditPropMode = (typeof inlineEditPropMode)[number];

export type InlineEditRenderEditProps<T> = {
  value: T;
  onChange(value: T): void;
  /** Whether the last save attempt exposed a validation error. */
  isInvalid: boolean;
  /** Validation error for the current draft after a save attempt. */
  validationError: ReactNode;
  /** Saves the current draft, or the supplied value when selection changes first. */
  commit(value?: T): void;
};

export type InlineEditPropSaveStatus =
  'idle' | 'pending' | 'progress' | 'error';

export type InlineEditSaveErrorContext = {
  error: unknown;
  retrySave(): void;
  open(): void;
  toggleMode(): void;
  rollback(): void;
};

export type InlineEditSaveErrorHandler = (
  context: InlineEditSaveErrorContext
) => void;

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
  /** Action button or menu rendered at the end of the view value. */
  menu?: ReactNode;
  /** Accessible name for the menu group. */
  menuAriaLabel?: string;
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
  /** Returns an error node for an invalid draft, or null/undefined when valid. */
  validate?: (value: T) => ReactNode;
  /** Whether an invalid save attempt shows the validation tooltip. */
  showTooltipOnError?: boolean;
  /** Validation tooltip placement. */
  validationTooltipPlacement?: TooltipPropPlacement;
  /** Saves a changed value in the background after the editor closes. */
  onSave?: (value: T) => Promise<unknown>;
  /** Compares the draft with the opening value to skip an unchanged request. */
  compareWith?: (draft: T, initialValue: T) => boolean;
  /** Called when a background save rejects. */
  onSaveError?: InlineEditSaveErrorHandler;
  /** Renders custom error actions below the value. */
  renderSaveError?: (context: InlineEditSaveErrorContext) => ReactNode;
  /** Called after a local save. */
  onSaved?: (value: T) => void;
  /** Called after cancel restores the opening value. */
  onCanceled?: () => void;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
};
