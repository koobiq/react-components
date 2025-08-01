import type {
  ComponentRef,
  CSSProperties,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';

import type { ExtendableProps, Node } from '@koobiq/react-core';
import type {
  AriaSelectProps,
  useMultiSelectState,
} from '@koobiq/react-primitives';

import type {
  FieldErrorProps,
  FieldLabelProps,
  FieldSelectProps,
  FieldCaptionProps,
  FieldInputGroupProps,
} from '../FieldComponents';
import type { ListProps } from '../List';
import type { PopoverProps } from '../Popover';

export type SelectProps<T> = ExtendableProps<
  {
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
    renderValue?: (props: Node<T>[] | null) => ReactElement;
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
  },
  Omit<
    AriaSelectProps<T>,
    | 'description'
    | 'validate'
    | 'validationBehavior'
    | 'validationState'
    | 'selectedKey'
    | 'onSelectionChange'
    | 'defaultSelectedKey'
  >
>;

export type SelectComponent = <T>(props: SelectProps<T>) => ReactElement | null;

export type SelectRef = ComponentRef<'button'>;
