import type {
  ComponentRef,
  CSSProperties,
  ForwardRefExoticComponent,
  ReactElement,
  ReactNode,
  Ref,
  RefAttributes,
} from 'react';

import type { DataAttributeProps, ExtendableProps } from '@koobiq/react-core';
import type {
  AriaTreeSelectProps,
  TreeSelectNode as PrimitiveTreeSelectNode,
} from '@koobiq/react-primitives';

import type {
  FormFieldCaptionProps,
  FormFieldControlGroupProps,
  FormFieldControlGroupPropVariant,
  FormFieldErrorProps,
  FormFieldLabelProps,
  FormFieldPropLabelAlign,
  FormFieldPropLabelPlacement,
  FormFieldProps,
  FormFieldSelectProps,
} from '../FormField';
import {
  formFieldControlGroupPropVariant,
  formFieldPropLabelAlign,
  formFieldPropLabelPlacement,
} from '../FormField';
import type { IconButtonProps } from '../IconButton';
import type { PopoverProps } from '../Popover';
import type { SearchInputProps } from '../SearchInput';
import type { TreeProps } from '../Tree';

/** A single node of the {@link TreeSelectProps.items | TreeSelect data}. */
export type TreeSelectNode = PrimitiveTreeSelectNode;

export type TreeSelectItemProps = {
  /** Unique identifier of the node. */
  id: string;
  /** Text used for searching/filtering. */
  textValue?: string;
  /** If `true`, the node can't be selected. */
  isDisabled?: boolean;
  /** Rendered node label and nested `TreeSelect.Item` nodes. */
  children?: ReactNode;
};

export type TreeSelectItemComponent = (
  props: TreeSelectItemProps
) => ReactElement | null;

export const treeSelectPropLabelPlacement = formFieldPropLabelPlacement;
export type TreeSelectPropLabelPlacement = FormFieldPropLabelPlacement;

export const treeSelectPropLabelAlign = formFieldPropLabelAlign;
export type TreeSelectPropLabelAlign = FormFieldPropLabelAlign;

export const treeSelectPropVariant = formFieldControlGroupPropVariant;
export type TreeSelectPropVariant = FormFieldControlGroupPropVariant;

export type TreeSelectRenderValueState = {
  isInvalid?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
};

export type TreeSelectProps = ExtendableProps<
  {
    /** Root nodes of the dynamic tree collection. */
    items?: TreeSelectNode[];
    /** Static tree collection. */
    children?: ReactNode;
    /** The search query (controlled). */
    inputValue?: string;
    /** The initial search query (uncontrolled). */
    defaultInputValue?: string;
    /** Handler called when the search query changes. */
    onInputChange?: (value: string) => void;
    /**
     * Enables search input inside the dropdown.
     * @default true
     */
    isSearchable?: boolean;
    /** Placeholder for the search field. */
    searchPlaceholder?: string;
    /** Accessible label for the search field. */
    searchAriaLabel?: string;
    /** Placeholder shown in the closed control when nothing is selected. */
    placeholder?: string | number;
    /**
     * The variant to use.
     * @default 'filled'
     */
    variant?: TreeSelectPropVariant;
    /** Addon placed before the control. */
    startAddon?: ReactNode;
    /** Addon placed after the control. */
    endAddon?: ReactNode;
    /** Whether the field can be emptied. */
    isClearable?: boolean;
    /** Handler called when the clear button is clicked. */
    onClear?: () => void;
    /** A render function for displaying the selected value. */
    renderValue?: (
      node: TreeSelectNode | null,
      state: TreeSelectRenderValueState
    ) => ReactNode;
    /**
     * Content shown when no node matches the query.
     * @default 'Nothing found'
     */
    noResultsText?: ReactNode;
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
    /** Inline styles. */
    style?: CSSProperties;
    /** Ref to the control. */
    ref?: Ref<HTMLDivElement>;
    /** Unique identifier for testing purposes. */
    'data-testid'?: string | number;
    /** The props used for each slot inside. */
    slotProps?: {
      root?: FormFieldProps;
      popover?: PopoverProps;
      label?: FormFieldLabelProps;
      group?: FormFieldControlGroupProps;
      control?: FormFieldSelectProps;
      caption?: FormFieldCaptionProps;
      errorMessage?: FormFieldErrorProps;
      clearButton?: IconButtonProps;
      searchInput?: SearchInputProps;
      tree?: Omit<
        TreeProps<TreeSelectNode>,
        | 'children'
        | 'items'
        | 'selectionMode'
        | 'selectedKeys'
        | 'onSelectionChange'
      >;
    };
  },
  Omit<AriaTreeSelectProps, 'items'>
> &
  DataAttributeProps;

export type TreeSelectComponent = ForwardRefExoticComponent<
  Omit<TreeSelectProps, 'ref'> & RefAttributes<TreeSelectRef>
> &
  ((props: TreeSelectProps) => ReactElement | null) & {
    Item: TreeSelectItemComponent;
  };

export type TreeSelectRef = ComponentRef<'div'>;
