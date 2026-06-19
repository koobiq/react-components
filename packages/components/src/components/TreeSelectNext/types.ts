import { type CSSProperties, type ReactNode } from 'react';

import { type RefObject } from '@koobiq/react-core';

import {
  type FormFieldCaptionProps,
  type FormFieldControlGroupProps,
  type FormFieldControlGroupPropVariant,
  formFieldControlGroupPropVariant,
  type FormFieldErrorProps,
  type FormFieldLabelProps,
  type FormFieldPropLabelAlign,
  formFieldPropLabelAlign,
  type FormFieldPropLabelPlacement,
  formFieldPropLabelPlacement,
  type FormFieldProps,
  type FormFieldSelectProps,
} from '../FormField';
import type { IconButtonProps } from '../IconButton';
import type { PopoverProps } from '../Popover';

import type { TreeCollection } from './TreeInner';
import type { TreeSelectStateOptions } from './useTreeSelectState';

export const treeSelectPropLabelPlacement = formFieldPropLabelPlacement;
export type TreeSelectPropLabelPlacement = FormFieldPropLabelPlacement;

export const treeSelectPropLabelAlign = formFieldPropLabelAlign;
export type TreeSelectPropLabelAlign = FormFieldPropLabelAlign;

export const treeSelectPropVariant = formFieldControlGroupPropVariant;
export type TreeSelectPropVariant = FormFieldControlGroupPropVariant;

type AriaTreeSelectProps<T extends object> = TreeSelectStateOptions<T>;

export type TreeSelectProps<T extends object> = {
  /** Whether the field can be emptied. */
  isClearable?: boolean;
  /** Handler called when the clear button is clicked. */
  onClear?: () => void;
  /** Addon placed before the control. */
  startAddon?: ReactNode;
  /** Addon placed after the control. */
  endAddon?: ReactNode;
  /** The helper text content. */
  caption?: ReactNode;
  /**
   * The variant to use.
   * @default 'filled'
   */
  variant?: TreeSelectPropVariant;
  /**
   * If `true`, the label is hidden. Be sure to add aria-label to the input element.
   */
  isLabelHidden?: boolean;
  /**
   * The label's overall position relative to the element it is labeling.
   * @default 'top'
   */
  labelPlacement?: TreeSelectPropLabelPlacement;
  /**
   * The label's horizontal alignment relative to the element it is labeling.
   * @default 'start'
   */
  labelAlign?: TreeSelectPropLabelAlign;
  /** If true, the input will take up the full width of its container. */
  fullWidth?: boolean;
  /** Additional CSS class. */
  className?: string;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
  /** Inline styles. */
  style?: CSSProperties;
  /** The search query (controlled). */
  inputValue?: string;
  /** The initial search query (uncontrolled). */
  defaultInputValue?: string;
  /** Handler called when the search query changes. */
  onInputChange?: (value: string) => void;
  /** The props used for each slot inside. */
  slotProps?: {
    root?: FormFieldProps;
    label?: FormFieldLabelProps;
    caption?: FormFieldCaptionProps;
    errorMessage?: FormFieldErrorProps;
    group?: FormFieldControlGroupProps;
    clearButton?: IconButtonProps;
    control?: FormFieldSelectProps;
    popover?: PopoverProps;
  };
} & Omit<AriaTreeSelectProps<T>, 'description'>;

export type TestInnerProps<T extends object> = {
  props: TreeSelectProps<T>;
  collection: TreeCollection<T>;
  treeRef?: RefObject<HTMLDivElement | null>;
};
