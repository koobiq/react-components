import type {
  ComponentRef,
  CSSProperties,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';

import type { ExtendableProps } from '@koobiq/react-core';
import type {
  AriaSelectProps,
  MultiSelectState,
  useMultiSelectState,
} from '@koobiq/react-primitives';

import type {
  FormFieldLabelProps,
  FormFieldErrorProps,
  FormFieldSelectProps,
  FormFieldCaptionProps,
  FormFieldPropLabelAlign,
  FormFieldControlGroupProps,
  FormFieldPropLabelPlacement,
} from '../FormField';
import {
  formFieldPropLabelAlign,
  formFieldPropLabelPlacement,
} from '../FormField';
import type { IconButtonProps } from '../IconButton';
import type { PopoverProps } from '../Popover';

import type { SelectListProps } from './components';

export const selectPropSelectedTagsOverflow = [
  'multiline',
  'responsive',
] as const;

export type SelectPropSelectedTagsOverflow =
  (typeof selectPropSelectedTagsOverflow)[number];

export const selectPropLabelPlacement = formFieldPropLabelPlacement;
export type SelectPropLabelPlacement = FormFieldPropLabelPlacement;

export const selectPropLabelAlign = formFieldPropLabelAlign;
export type SelectPropLabelAlign = FormFieldPropLabelAlign;

export type SelectProps<T> = ExtendableProps<
  {
    /**
     * Defines how selected tags are displayed when they exceed the available space.
     *
     *- `"multiline"` — tags wrap to multiple lines.
     *- `"responsive"` — tags collapse into a summary (e.g., "3 more").
     * @default 'responsive'
     */
    selectedTagsOverflow?: SelectPropSelectedTagsOverflow;
    /** Handler that is called when the clear button is clicked. */
    onClear?: () => void;
    /** Sets the CSS [`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) for the element. */
    className?: string;
    /** The initial selected keys in the collection (uncontrolled). */
    defaultSelectedKeys?: Parameters<
      typeof useMultiSelectState
    >['0']['defaultSelectedKeys'];
    /** Whether the field can be emptied. */
    isClearable?: boolean;
    /** Handler that is called when the selection changes. */
    onSelectionChange?: Parameters<
      typeof useMultiSelectState
    >['0']['onSelectionChange'];
    /** The currently selected keys in the collection (controlled). */
    selectedKeys?: Parameters<typeof useMultiSelectState>['0']['selectedKeys'];
    validate?: Parameters<typeof useMultiSelectState>['0']['validate'];
    validationBehavior?: Parameters<
      typeof useMultiSelectState
    >['0']['validationBehavior'];
    /**
     * The type of selection that is allowed in the collection.
     * @default 'single'
     */
    selectionMode?: 'single' | 'multiple';
    /** Addon placed before the children. */
    startAddon?: ReactNode;
    /** Addon placed after the children. */
    endAddon?: ReactNode;
    /** Inline styles. */
    style?: CSSProperties;
    /**
     * If `true`, the label is hidden. Be sure to add aria-label to the input element.
     */
    isLabelHidden?: boolean;
    /**
     * The label's overall position relative to the element it is labeling.
     * @default 'top'
     */
    labelPlacement?: SelectPropLabelPlacement;
    /**
     * The label's horizontal alignment relative to the element it is labeling.
     * @default 'start'
     */
    labelAlign?: SelectPropLabelAlign;
    /** The helper text content. */
    caption?: ReactNode;
    /**
     * If true, the input will take up the full width of its container.
     */
    fullWidth?: boolean;
    /** The load more spinner to render when loading additional items. */
    isLoading?: boolean;
    /** Handler that is called when more items should be loaded, e.g. while scrolling near the bottom. */
    onLoadMore?: () => void;
    /** Unique identifier for testing purposes. */
    'data-testid'?: string | number;
    /** Ref to the control */
    ref?: Ref<HTMLDivElement>;
    /** A render function for displaying the selected value. */
    renderValue?: (
      state: MultiSelectState<T>,
      states: {
        isInvalid?: boolean;
        isDisabled?: boolean;
        isRequired?: boolean;
      }
    ) => ReactNode;
    /** Content to display when no items are available. */
    noItemsText?: ReactNode;
    /** The props used for each slot inside. */
    slotProps?: {
      popover?: PopoverProps;
      label?: FormFieldLabelProps;
      list?: Omit<SelectListProps<object>, 'state'>;
      control?: FormFieldSelectProps;
      caption?: FormFieldCaptionProps;
      group?: FormFieldControlGroupProps;
      errorMessage?: FormFieldErrorProps;
      clearButton?: IconButtonProps;
    };
  },
  Omit<
    AriaSelectProps<T>,
    | 'description'
    | 'validationBehavior'
    | 'validate'
    | 'validationState'
    | 'selectedKey'
    | 'onSelectionChange'
    | 'defaultSelectedKey'
  >
>;

export type SelectComponent = <T>(props: SelectProps<T>) => ReactElement | null;

export type SelectRef = ComponentRef<'div'>;
