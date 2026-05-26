import type { Ref, CSSProperties, ComponentRef, ReactNode } from 'react';

import type { TextField } from '@koobiq/react-primitives';

import type {
  FormFieldProps,
  FormFieldInputProps,
  FormFieldLabelProps,
  FormFieldErrorProps,
  FormFieldCaptionProps,
  FormFieldPropLabelAlign,
  FormFieldControlGroupProps,
  FormFieldPropLabelPlacement,
  FormFieldControlGroupPropVariant,
} from '../FormField';
import {
  formFieldControlGroupPropVariant,
  formFieldPropLabelAlign,
  formFieldPropLabelPlacement,
} from '../FormField';
import type { IconButtonProps } from '../IconButton';
import type { TagListInnerProps } from '../TagList';

export const tagInputPropVariant = formFieldControlGroupPropVariant;
export type TagInputPropVariant = FormFieldControlGroupPropVariant;

export const tagInputPropLabelPlacement = formFieldPropLabelPlacement;
export type TagInputPropLabelPlacement = FormFieldPropLabelPlacement;

export const tagInputPropLabelAlign = formFieldPropLabelAlign;
export type TagInputPropLabelAlign = FormFieldPropLabelAlign;

/**
 * Item in the tag collection. The id always matches the string value — this
 * is the simple TagInput model. `TagAutocomplete` will use a richer item
 * shape with independent ids and labels.
 */
export interface TagInputItem {
  id: string;
  value: string;
}

export interface TagInputProps {
  /** Controlled list of tags. Each string is both the key and the label. */
  value?: string[];
  /** Uncontrolled initial list of tags. */
  defaultValue?: string[];
  /** Fires whenever the tag list changes (add / remove / clear). */
  onChange?: (next: string[]) => void;
  /** Controlled value of the text input. */
  inputValue?: string;
  /** Uncontrolled initial value of the text input. */
  defaultInputValue?: string;
  /** Fires whenever the text input value changes. */
  onInputChange?: (value: string) => void;
  /**
   * Characters (besides Enter) that commit the current input as a new tag.
   * @default /,/
   */
  splitPattern?: RegExp;
  /** Placeholder for the text input. */
  placeholder?: string;
  /** Whether to show the cleaner button that removes all tags and the input. */
  isClearable?: boolean;
  /** Fires when the cleaner is pressed (after the tags and input are reset). */
  onClear?: () => void;
  /** The label of the field. */
  label?: ReactNode;
  /** Helper text below the field. */
  caption?: ReactNode;
  /** Error message shown when `isInvalid` is true. */
  errorMessage?: ReactNode;
  /** Whether the field is disabled. */
  isDisabled?: boolean;
  /** Whether the field is read-only — tags visible, can't add or remove. */
  isReadOnly?: boolean;
  /** Whether the field is required. */
  isRequired?: boolean;
  /** Whether the field is in an invalid state. */
  isInvalid?: boolean;
  /** Whether the label is visually hidden. */
  isLabelHidden?: boolean;
  /** Whether the field takes up the full width of its container. */
  fullWidth?: boolean;
  /**
   * The variant to use.
   * @default 'filled'
   */
  variant?: TagInputPropVariant;
  /**
   * The label's overall position relative to the element it is labeling.
   * @default 'top'
   */
  labelPlacement?: TagInputPropLabelPlacement;
  /**
   * The label's horizontal alignment relative to the element it is labeling.
   * @default 'start'
   */
  labelAlign?: TagInputPropLabelAlign;
  /** Accessible label for the text input. */
  'aria-label'?: string;
  /** Id of the element that labels the text input. */
  'aria-labelledby'?: string;
  /** Id of the element that describes the text input. */
  'aria-describedby'?: string;
  /** Form field name (used when the component is submitted in a form). */
  name?: string;
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
  /** Ref forwarded to the underlying text input. */
  ref?: Ref<HTMLInputElement>;
  /** Props used for each slot inside. */
  slotProps?: {
    root?: FormFieldProps<typeof TextField<HTMLInputElement>>;
    label?: FormFieldLabelProps;
    caption?: FormFieldCaptionProps;
    group?: FormFieldControlGroupProps;
    errorMessage?: FormFieldErrorProps;
    clearButton?: IconButtonProps;
    input?: FormFieldInputProps;
    tagList?: Partial<Omit<TagListInnerProps<TagInputItem>, 'state'>>;
  };
}

export type TagInputRef = ComponentRef<'input'>;
