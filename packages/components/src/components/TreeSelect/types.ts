import type {
  ComponentRef,
  CSSProperties,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';

import type { DataAttributeProps, RefObject } from '@koobiq/react-core';
import type {
  SelectionMode,
  TreeProps as AriaTreeProps,
  TreeSelectStateOptions,
} from '@koobiq/react-primitives';

import type { DropdownFooterProps } from '../DropdownFooter';
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
import type { SearchInputProps } from '../SearchInput';
import { selectedTagsPropOverflow } from '../SelectedTags';

import type { TreeCollection } from './TreeInner';

export const treeSelectPropLabelPlacement = formFieldPropLabelPlacement;
export type TreeSelectPropLabelPlacement = FormFieldPropLabelPlacement;

export const treeSelectPropLabelAlign = formFieldPropLabelAlign;
export type TreeSelectPropLabelAlign = FormFieldPropLabelAlign;

export const treeSelectPropVariant = formFieldControlGroupPropVariant;
export type TreeSelectPropVariant = FormFieldControlGroupPropVariant;

export const treeSelectPropSelectedTagsOverflow = selectedTagsPropOverflow;
export type TreeSelectPropSelectedTagsOverflow =
  (typeof treeSelectPropSelectedTagsOverflow)[number];

type AriaTreeSelectProps<
  T extends object,
  M extends SelectionMode = 'single',
> = TreeSelectStateOptions<T, M>;

export type TreeSelectProps<
  T extends object,
  M extends SelectionMode = 'single',
> = {
  /** Defines how selected tags are displayed when they exceed the available space. */
  selectedTagsOverflow?: TreeSelectPropSelectedTagsOverflow;
  /** Whether the field can be emptied. */
  isClearable?: boolean;
  /** Handler called when the clear button is clicked. */
  onClear?: () => void;
  /** Addon placed before the control. */
  startAddon?: ReactNode;
  /** Addon placed after the control. */
  endAddon?: ReactNode;
  /** Content to display at the bottom of the dropdown. */
  dropdownFooter?: ReactNode;
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
  /** Ref to the control. */
  ref?: Ref<HTMLDivElement>;
  /** Enables search input for filtering items in the list. */
  isSearchable?: boolean;
  /** The search query (controlled). */
  inputValue?: string;
  /** The initial search query (uncontrolled). */
  defaultInputValue?: string;
  /** Handler called when the search query changes. */
  onInputChange?: (value: string) => void;
  /** The filter function used to determine whether an item should be included in the search results. */
  defaultFilter?: (textValue: string, inputValue: string) => boolean;
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
    dropdownFooter?: DropdownFooterProps & DataAttributeProps;
    tree?: Omit<AriaTreeProps<T>, 'children' | 'items'> & DataAttributeProps;
    'search-input'?: SearchInputProps;
  };
} & Omit<AriaTreeSelectProps<T, M>, 'description' | 'validationState'>;

export type TreeSelectComponent = <
  T extends object,
  M extends SelectionMode = 'single',
>(
  props: TreeSelectProps<T, M>
) => ReactElement | null;

export type TreeSelectRef = ComponentRef<'div'>;

export type TreeSelectInnerProps<
  T extends object,
  M extends SelectionMode = 'single',
> = {
  props: TreeSelectProps<T, M>;
  collection: TreeCollection<T>;
  controlRef: RefObject<HTMLDivElement | null>;
};
