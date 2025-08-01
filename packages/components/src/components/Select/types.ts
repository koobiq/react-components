import type {
  ComponentRef,
  CSSProperties,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';

import type { ExtendableProps, Node } from '@koobiq/react-core';
import type { AriaSelectProps } from '@koobiq/react-primitives';

import type {
  FieldErrorProps,
  FieldLabelProps,
  FieldSelectProps,
  FieldCaptionProps,
  FieldInputGroupProps,
} from '../FieldComponents';
import type { ListProps } from '../List';
import type { PopoverProps } from '../Popover';

export type SelectKey = string | number;

type SelectDeprecatedProps = {
  /**
   * If `true`, the component is disabled.
   * @default false
   * @deprecated
   * The "disabled" prop is deprecated. Use "isDisabled" prop to replace it.
   */
  disabled?: boolean;
  /**
   * If `true`, the input will indicate an error.
   * @default false
   * @deprecated
   * The "error" prop is deprecated. Use "isInvalid" prop to replace it.
   */
  error?: boolean;
  /**
   * If `true`, the label is displayed as required and the input element is required.
   * @default false
   * @deprecated
   * The "required" prop is deprecated. Use "isRequired" prop to replace it.
   */
  required?: boolean;
  /**
   * Sets the open state of the menu.
   * @deprecated
   * The "open" prop is deprecated. Use "isOpen" prop to replace it.
   */
  open?: boolean;
  /**
   * If `true`, the label is hidden. Be sure to add aria-label to the input element.
   * @default false
   * @deprecated
   * The "hiddenLabel" prop is deprecated. Use "isLabelHidden" prop to replace it.
   */
  hiddenLabel?: boolean;
};

export type SelectProps<T> = ExtendableProps<
  {
    /** Additional CSS-classes. */
    className?: string;
    /** Addon placed before the children. */
    startAddon?: ReactNode;
    /** Addon placed after the children. */
    endAddon?: ReactNode;
    /** Inline styles. */
    style?: CSSProperties;
    /** An error message for the field. */
    errorMessage?: ReactNode;
    /**
     * If `true`, the label is hidden. Be sure to add aria-label to the input element.
     * @default false
     */
    isLabelHidden?: boolean;
    /** The helper text content. */
    caption?: ReactNode;
    /**
     * If true, the input will take up the full width of its container.
     * @default false
     */
    fullWidth?: boolean;
    /** Unique identifier for testing purposes. */
    'data-testid'?: string | number;
    /** Ref to the control */
    ref?: Ref<HTMLButtonElement>;
    /** A render function for displaying the selected value. */
    renderValue?: (props: Node<T> | null) => ReactElement;
    /** The props used for each slot inside. */
    slotProps?: {
      popover?: PopoverProps;
      label?: FieldLabelProps;
      list?: ListProps<T>;
      control?: FieldSelectProps;
      caption?: FieldCaptionProps;
      group?: FieldInputGroupProps;
      errorMessage?: FieldErrorProps;
    };
  } & SelectDeprecatedProps,
  Omit<AriaSelectProps<T>, 'description' | 'validationState'>
>;

export type SelectComponent = <T>(props: SelectProps<T>) => ReactElement | null;

export type SelectRef = ComponentRef<'button'>;
