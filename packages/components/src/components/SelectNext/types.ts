import type {
  ComponentRef,
  CSSProperties,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';

import type { ExtendableProps } from '@koobiq/react-core';
import type { AriaSelectProps, SelectState } from '@koobiq/react-primitives';
import type { SelectionMode } from '@react-types/select';

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
import type { SearchInputProps } from '../SearchInput';

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

export type SelectProps<
  T extends object,
  M extends SelectionMode = 'single',
> = ExtendableProps<
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
    /** Whether the field can be emptied. */
    isClearable?: boolean;
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
      state: SelectState<T, M>,
      states: {
        isInvalid?: boolean;
        isDisabled?: boolean;
        isRequired?: boolean;
      }
    ) => ReactNode;
    /** Content to display when no items are available. */
    noItemsText?: ReactNode;
    /** Content to display when items are loading. */
    loadingText?: ReactNode;
    /** Enables search input for filtering items in the list. */
    isSearchable?: boolean;
    /** The value of the Select search input (controlled). */
    inputValue?: string;
    /** The default value of the Select search input (uncontrolled). */
    defaultInputValue?: string;
    /** Handler that is called when the Select search input value changes. */
    onInputChange?: (value: string) => void;
    /** The filter function used to determine if a option should be included in the Select list. */
    defaultFilter?: (textValue: string, inputValue: string) => boolean;
    /** The props used for each slot inside. */
    slotProps?: {
      popover?: PopoverProps;
      label?: FormFieldLabelProps;
      clearButton?: IconButtonProps;
      control?: FormFieldSelectProps;
      caption?: FormFieldCaptionProps;
      group?: FormFieldControlGroupProps;
      errorMessage?: FormFieldErrorProps;
      list?: Omit<SelectListProps<T, M>, 'state'>;
      'search-input'?: SearchInputProps;
    };
  },
  Omit<
    AriaSelectProps<T, M>,
    | 'description'
    | 'validationState'
    | 'selectedKey'
    | 'onSelectionChange'
    | 'defaultSelectedKey'
  >
>;

export type SelectComponent = <
  T extends object,
  M extends SelectionMode = 'single',
>(
  props: SelectProps<T, M>
) => ReactElement | null;

export type SelectRef = ComponentRef<'div'>;
