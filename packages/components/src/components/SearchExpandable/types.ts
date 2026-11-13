import type { CSSProperties } from 'react';

import type { DataAttributeProps, ExtendableProps } from '@koobiq/react-core';

import type {
  FormFieldClearButtonProps,
  FormFieldInputProps,
} from '../FormField';
import type { IconButtonProps } from '../IconButton';
import type { SearchInputProps } from '../SearchInput';
import type { TooltipProps } from '../Tooltip';

import type {
  searchExpandableOwnedButtonSlotKeys,
  searchExpandableOwnedCloseButtonSlotKeys,
  searchExpandableOwnedInputSlotKeys,
} from './utils';

/** The default committed value of SearchExpandable. */
export const searchExpandableDefaultValue = '';

/** The default delay before SearchExpandable emits the value, in milliseconds. */
export const searchExpandableDefaultEmitValueTimeout = 200;

export type SearchExpandableRef = {
  /** The root element. */
  element: HTMLDivElement | null;
  /** Toggles the expanded state. */
  toggle: () => void;
};

/**
 * The props of the collapsed trigger slot. The trigger stays visible and
 * enabled according to the component, and keeps its own accessible name,
 * tab index, button type, and `aria-expanded`.
 */
export type SearchExpandableButtonSlotProps = Omit<
  IconButtonProps,
  (typeof searchExpandableOwnedButtonSlotKeys)[number]
>;

/**
 * The props of the expanded input slot. The owned draft, type, auto-complete,
 * tab index, accessible name, and field state cannot be overridden.
 */
export type SearchExpandableInputSlotProps = Omit<
  FormFieldInputProps,
  (typeof searchExpandableOwnedInputSlotKeys)[number]
>;

/**
 * The props of the close button slot. The button always stays visible, enabled
 * according to the component, and keyboard reachable.
 */
export type SearchExpandableCloseButtonSlotProps = Omit<
  FormFieldClearButtonProps,
  (typeof searchExpandableOwnedCloseButtonSlotKeys)[number]
>;

export type SearchExpandableProps = ExtendableProps<
  {
    /**
     * The controlled committed value.
     * `null` displays as an empty field.
     */
    value?: string | null;
    /**
     * The initial uncontrolled committed value.
     * @default ''
     */
    defaultValue?: string;
    /** Handler that is called when the committed value changes. */
    onChange?: (value: string) => void;
    /** The controlled open state. */
    isOpen?: boolean;
    /**
     * The initial uncontrolled open state.
     * @default false
     */
    defaultOpen?: boolean;
    /** Handler that is called when the open state changes. */
    onOpenChange?: (isOpen: boolean) => void;
    /**
     * The delay before the value is emitted, in milliseconds.
     * @default 200
     */
    emitValueTimeout?: number;
    /**
     * If `true`, the value is emitted only when Enter is pressed.
     * @default false
     */
    isEmitValueByEnterEnabled?: boolean;
    /**
     * The collapsed button tooltip and accessible name.
     * When `null`, `undefined` or empty, the localized label is used.
     */
    tooltipText?: string | null;
    /**
     * The expanded input placeholder and accessible name.
     * When `null`, `undefined` or empty, the localized label is used.
     */
    placeholder?: string | null;
    /**
     * If `true`, the component is disabled.
     * @default false
     */
    isDisabled?: boolean;
    /**
     * The tab index of the collapsed button, the expanded input, and the
     * close button.
     * @default 0
     */
    tabIndex?: number | null;
    /** Additional CSS-classes. */
    className?: string;
    /** Inline styles. */
    style?: CSSProperties;
    /** The props used for each slot inside. */
    slotProps?: {
      button?: SearchExpandableButtonSlotProps;
      /**
       * The props of the tooltip slot. The content, the control, and the
       * disabled state are owned by the component and cannot be overridden.
       */
      tooltip?: Omit<TooltipProps, 'children' | 'control' | 'isDisabled'>;
      input?: SearchExpandableInputSlotProps;
      closeButton?: SearchExpandableCloseButtonSlotProps;
    };
  } & DataAttributeProps,
  Omit<
    SearchInputProps,
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'startAddon'
    | 'endAddon'
    | 'label'
    | 'isLabelHidden'
    | 'isReadOnly'
    | 'labelPlacement'
    | 'labelAlign'
    | 'aria-label'
    | 'aria-labelledby'
    | 'type'
    | 'autoComplete'
    | 'onKeyDown'
    | 'onKeyUp'
    | 'onSubmit'
    | 'onClear'
    | 'className'
    | 'style'
    | 'slotProps'
  >
>;
