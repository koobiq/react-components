import type {
  Ref,
  CSSProperties,
  ComponentRef,
  ReactNode,
  ReactElement,
} from 'react';

import type { CollectionChildren, Key, Selection } from '@koobiq/react-core';
import type {
  AriaTextFieldProps,
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

export const tagInputPropVariant = formFieldControlGroupPropVariant;
export type TagInputPropVariant = FormFieldControlGroupPropVariant;

export const tagInputPropLabelPlacement = formFieldPropLabelPlacement;
export type TagInputPropLabelPlacement = FormFieldPropLabelPlacement;

export const tagInputPropLabelAlign = formFieldPropLabelAlign;
export type TagInputPropLabelAlign = FormFieldPropLabelAlign;

/** How the user's input ended up as new tags. */
export type TagInputAddSource = TagFieldAddSource;

export type TagInputAddContext<T = unknown> = TagFieldAddContext<T>;

export interface TagInputProps<T extends object = object> {
  /** Tag collection — owned by the consumer (e.g. via `useListData`). */
  items?: Iterable<T>;
  /** Render function for each item in the collection. */
  children: CollectionChildren<T>;
  /** Fires when the user commits one or more new values from the text input. */
  onAdd?: (values: string[], context: TagInputAddContext<T>) => void;
  /** Fires when the user removes one or more tags. */
  onRemove?: (keys: Set<Key>) => void;
  /** Controlled value of the text input. */
  inputValue?: string;
  /** Uncontrolled initial value of the text input. */
  defaultInputValue?: string;
  /** Fires whenever the text input value changes. */
  onInputChange?: (value: string) => void;
  /** Controlled set of selected tag keys. */
  selectedKeys?: Selection;
  /** Uncontrolled initial set of selected tag keys. */
  defaultSelectedKeys?: Iterable<Key>;
  /** Fires when the user changes which tags are selected. */
  onSelectionChange?: (keys: Selection) => void;
  /** Keys of tags that should be rendered as disabled. */
  disabledKeys?: Iterable<Key>;
  /**
   * Characters (besides Enter) that commit the current input as a new tag.
   * @default /,/
   */
  splitPattern?: RegExp;
  /**
   * Whether to suppress committing the input value as a new tag when focus leaves the field.
   * @default false
   */
  disableCommitOnBlur?: boolean;
  /** Placeholder for the text input. */
  placeholder?: string;
  /** Whether to show the cleaner button that removes all tags and the input. */
  isClearable?: boolean;
  /** Fires after the cleaner is pressed and the field is reset. */
  onClear?: () => void;
  /** The label of the field. */
  label?: ReactNode;
  /** Helper text below the field. */
  caption?: ReactNode;
  /** Error message shown when `isInvalid` is true. */
  errorMessage?: ReactNode;
  /** Whether the field is disabled. */
  isDisabled?: boolean;
  /** Whether the field is read-only — tags visible, but no add / remove / select. */
  isReadOnly?: boolean;
  /** Whether the field is required. */
  isRequired?: boolean;
  /** Whether the field is in an invalid state. */
  isInvalid?: boolean;
  /**
   * Whether to use native HTML form validation or ARIA validation.
   * @default 'aria'
   */
  validationBehavior?: AriaTextFieldProps<HTMLInputElement>['validationBehavior'];
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
  /** Id forwarded to the underlying text input. */
  id?: string;
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
}

export type TagInputComponent = <T extends object = object>(
  props: TagInputProps<T> & { ref?: Ref<TagInputRef> }
) => ReactElement | null;

export type TagInputRef = ComponentRef<'input'>;
