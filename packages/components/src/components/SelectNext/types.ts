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
  FieldErrorProps,
  FieldLabelProps,
  FieldSelectProps,
  FieldCaptionProps,
  FieldInputGroupProps,
} from '../FieldComponents';
import type { IconButtonProps } from '../IconButton';
import type { ListProps } from '../List';
import type { PopoverProps } from '../Popover';

export const selectPropSelectedTagsOverflow = [
  'multiline',
  'responsive',
] as const;

export type SelectPropSelectedTagsOverflow =
  (typeof selectPropSelectedTagsOverflow)[number];

export type SelectNextProps<T> = ExtendableProps<
  {
    /**
     * Defines how selected tags are displayed when they exceed the available space.
     *
     *- `"multiline"` — tags wrap to multiple lines.
     *- `"responsive"` — tags collapse into a summary (e.g., "3 more").
     * @default "responsive"
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
    /** The props used for each slot inside. */
    slotProps?: {
      popover?: PopoverProps;
      label?: FieldLabelProps;
      list?: ListProps<T>;
      control?: FieldSelectProps<'div'>;
      caption?: FieldCaptionProps;
      group?: FieldInputGroupProps;
      errorMessage?: FieldErrorProps;
      clearButton?: IconButtonProps;
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

export type SelectNextComponent = <T>(
  props: SelectNextProps<T>
) => ReactElement | null;

export type SelectNextRef = ComponentRef<'div'>;
