import type {
  ComponentRef,
  CSSProperties,
  ReactElement,
  ReactNode,
} from 'react';

import type { DataAttributeProps } from '@koobiq/react-core';
import type { AriaComboBoxProps } from '@koobiq/react-primitives';

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
import type { PopoverProps } from '../Popover';
import type { SelectListProps } from '../Select/components';

export const autocompletePropLabelPlacement = formFieldPropLabelPlacement;
export type AutocompletePropLabelPlacement = FormFieldPropLabelPlacement;

export const autocompletePropLabelAlign = formFieldPropLabelAlign;
export type AutocompletePropLabelAlign = FormFieldPropLabelAlign;

export const autocompletePropVariant = formFieldControlGroupPropVariant;
export type AutocompleteInputPropVariant = FormFieldControlGroupPropVariant;

export type AutocompleteProps<T extends object> = {
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
  /** If `true`, the label is hidden. Be sure to add aria-label to the input element. */
  isLabelHidden?: boolean;
  /** The helper text content. */
  caption?: ReactNode;
  /** Addon placed before the children. */
  startAddon?: ReactNode;
  /** Addon placed after the children. */
  endAddon?: ReactNode;
  /**
   * The label's overall position relative to the element it is labeling.
   * @default 'top'
   */
  labelPlacement?: AutocompletePropLabelPlacement;
  /**
   * The label's horizontal alignment relative to the element it is labeling.
   * @default 'start'
   */
  labelAlign?: AutocompletePropLabelAlign;
  /**
   * The variant to use.
   * @default 'filled'
   */
  variant?: AutocompleteInputPropVariant;
  /** If `true`, the input will take up the full width of its container. */
  fullWidth?: boolean;
  /** The props used for each slot inside. */
  slotProps?: {
    root?: FormFieldProps;
    popover?: PopoverProps;
    label?: FormFieldLabelProps;
    list?: Omit<SelectListProps<object>, 'state'>;
    control?: FormFieldSelectProps;
    caption?: FormFieldCaptionProps;
    group?: FormFieldControlGroupProps;
    errorMessage?: FormFieldErrorProps;
  };
} & DataAttributeProps &
  Omit<AriaComboBoxProps<T>, 'description' | 'validationState'>;

export type AutocompleteComponent = <T extends object>(
  props: AutocompleteProps<T>
) => ReactElement | null;

export type AutocompleteRef = ComponentRef<'input'>;
