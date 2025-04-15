import type {
  ComponentRef,
  CSSProperties,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';

import type { Node } from '@koobiq/react-primitives';

import type {
  FieldErrorProps,
  FieldLabelProps,
  FieldSelectProps,
  FieldCaptionProps,
  FieldInputGroupProps,
} from '../FieldComponents';
import type {
  ListPropItems,
  ListPropChildren,
  ListPropDisabledKeys,
} from '../List';
import type { PopoverProps } from '../Popover';

export type SelectKey = string | number;

export type SelectPropOnSelectionChange = (selected: SelectKey) => void;

export type SelectProps<T extends object> = {
  /** Additional CSS-classes. */
  className?: string;
  /** The content to display as the label. */
  label?: ReactNode;
  /** The contents of the collection. */
  children?: ListPropChildren<T>;
  /** Item objects in the collection. */
  items?: ListPropItems<T>;
  /** Addon placed before the children. */
  startAddon?: ReactNode;
  /** Addon placed after the children. */
  endAddon?: ReactNode;
  /** Inline styles. */
  style?: CSSProperties;
  /** The text appears in a control until the user puts focus on the field. */
  placeholder?: string;
  /**
   * If `true`, the input will indicate an error.
   * @default false
   * */
  error?: boolean;
  /** Message for the error state */
  errorMessage?: string | number;
  /**
   * If `true`, the label is hidden. Be sure to add aria-label to the input element.
   * @default false
   * */
  hiddenLabel?: boolean;
  /** The helper text content. */
  caption?: string | number;
  /**
   * If true, the input will take up the full width of its container.
   * @default false
   * */
  fullWidth?: boolean;
  /**
   * If `true`, the component is disabled.
   * @default false
   * */
  disabled?: boolean;
  /**
   * If `true`, the label is displayed as required and the input element is required.
   * @default false
   * */
  required?: boolean;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
  /** Ref to the control */
  ref?: Ref<HTMLButtonElement>;
  /** The item keys that are disabled. These items cannot be selected, focused, or otherwise interacted with. */
  disabledKeys?: ListPropDisabledKeys<T>;
  /** The initial selected key in the collection (uncontrolled). */
  defaultSelectedKey?: SelectKey;
  /** The currently selected key in the collection (controlled). */
  selectedKey?: SelectKey | null;
  /** Handler that is called when the selection changes. */
  onSelectionChange?: SelectPropOnSelectionChange;
  /** Sets the open state of the menu. */
  open?: boolean;
  /** Sets the default open state of the menu. */
  defaultOpen?: boolean;
  /** Method that is called when the open state of the menu changes. */
  onOpenChange?: (isOpen: boolean) => void;
  /** A render function for displaying the selected value. */
  renderValue?: (props: Node<T> | null) => ReactElement;
  name?: string;
  /** The props used for each slot inside. */
  slotProps?: {
    popover?: PopoverProps;
    label?: FieldLabelProps;
    list?: ListPropChildren<T>;
    control?: FieldSelectProps;
    caption?: FieldCaptionProps;
    group?: FieldInputGroupProps;
    errorMessage?: FieldErrorProps;
  };
};

export type SelectComponent = <T extends object>(
  props: SelectProps<T>
) => ReactElement | null;

export type SelectRef = ComponentRef<'button'>;
