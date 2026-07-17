import type {
  Ref,
  CSSProperties,
  ComponentRef,
  ReactNode,
  ReactElement,
} from 'react';

import type {
  AriaTagFieldProps,
  TagFieldAddContext,
  TagFieldAddSource,
} from '@koobiq/react-primitives';

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
import type { TagProps } from '../TagList/Tag';

export type TagInputTagProps<T extends object = object> = TagProps<T>;

export const tagInputPropVariant = formFieldControlGroupPropVariant;
export type TagInputPropVariant = FormFieldControlGroupPropVariant;

export const tagInputPropLabelPlacement = formFieldPropLabelPlacement;
export type TagInputPropLabelPlacement = FormFieldPropLabelPlacement;

export const tagInputPropLabelAlign = formFieldPropLabelAlign;
export type TagInputPropLabelAlign = FormFieldPropLabelAlign;

/** How the user's input ended up as new tags. */
export type TagInputAddSource = TagFieldAddSource;

export type TagInputAddContext<T = unknown> = TagFieldAddContext<T>;

type TagInputBaseProps<T extends object> = Omit<
  AriaTagFieldProps<T>,
  'description' | 'validate' | 'validationState' | 'isClearable'
>;

export type TagInputProps<T extends object = object> = TagInputBaseProps<T> & {
  /**
   * Whether to hide the cleaner button. By default a button that removes all
   * tags and resets the input is rendered.
   * @default false
   */
  hideClearButton?: boolean;
  /** Helper text below the field. */
  caption?: ReactNode;
  /** Addon placed before the tags/input content. */
  startAddon?: ReactNode;
  /** Addon placed after the tags/input content. */
  endAddon?: ReactNode;
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
    root?: FormFieldProps;
    label?: FormFieldLabelProps;
    caption?: FormFieldCaptionProps;
    group?: FormFieldControlGroupProps;
    errorMessage?: FormFieldErrorProps;
    clearButton?: IconButtonProps;
    input?: FormFieldInputProps;
    tagList?: Partial<Omit<TagListInnerProps<T>, 'state' | 'isDisabled'>>;
  };
};

export type TagInputComponent = <T extends object = object>(
  props: TagInputProps<T> & { ref?: Ref<TagInputRef> }
) => ReactElement | null;

export type TagInputRef = ComponentRef<'input'>;
