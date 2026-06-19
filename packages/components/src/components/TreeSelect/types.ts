import type {
  ComponentRef,
  CSSProperties,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';

import type { DataAttributeProps, ExtendableProps } from '@koobiq/react-core';
import type { AriaTreeSelectProps } from '@koobiq/react-primitives';

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
import type { Tree, TreeProps } from '../Tree';

export type TreeSelectItemProps = Parameters<typeof Tree.Item>[0];

export type TreeSelectItemComponent = typeof Tree.Item;

export type TreeSelectItemContentComponent = typeof Tree.ItemContent;

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

export type TreeSelectProps<T extends object = object> = ExtendableProps<
  {
    /** Root nodes of the tree collection. */
    items?: TreeProps<T>['items'];
    /** Static or render-function tree collection. */
    children?: TreeProps<T>['children'];
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
      node: T | null,
      state: TreeSelectRenderValueState
    ) => ReactNode;
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
      tree?: Omit<
        TreeProps<T>,
        | 'children'
        | 'items'
        | 'selectionMode'
        | 'selectedKeys'
        | 'onSelectionChange'
      >;
    };
  },
  Omit<AriaTreeSelectProps<T>, 'children' | 'items'>
> &
  DataAttributeProps;

export type TreeSelectComponent = (<T extends object>(
  props: TreeSelectProps<T>
) => ReactElement | null) & {
  displayName?: string;
  Item: TreeSelectItemComponent;
  ItemContent: TreeSelectItemContentComponent;
};

export type TreeSelectRef = ComponentRef<'div'>;
