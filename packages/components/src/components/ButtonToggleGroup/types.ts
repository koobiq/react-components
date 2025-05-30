import type { ComponentPropsWithRef, ComponentRef, ReactElement } from 'react';

import type {
  DataAttributeProps,
  ExtendableComponentPropsWithRef,
} from '@koobiq/react-core';

import type { ButtonToggleProps } from './components';

export type ButtonToggleGroupKey = string | number;

export type ButtonToggleGroupBaseProps = {
  /**
   * Whether all items are disabled.
   * @default false
   * */
  isDisabled?: boolean;
  /**
   * If `true`, the button will take up the full width of its container.
   * @default false
   * */
  fullWidth?: boolean;
  /** The contents of the collection. */
  children?: Array<ReactElement<ButtonToggleProps>>;
  /**
   * If `true`, each item's width will be equal.
   * @default false
   * */
  hasEqualItemSize?: boolean;
  /** The currently selected key in the collection (controlled). */
  selectedKey?: ButtonToggleGroupKey;
  /** The initial selected key in the collection (uncontrolled). */
  defaultSelectedKey?: ButtonToggleGroupKey;
  /** Handler that is called when the selection changes. */
  onSelectionChange?: (keys: ButtonToggleGroupKey) => void;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
  /** The props used for each slot inside. */
  slotProps?: {
    thumb?: ComponentPropsWithRef<'div'> & DataAttributeProps;
    container?: ComponentPropsWithRef<'div'> & DataAttributeProps;
  };
};

export type ButtonToggleGroupProps = ExtendableComponentPropsWithRef<
  ButtonToggleGroupBaseProps,
  'div'
>;

export type ButtonToggleGroupRef = ComponentRef<'div'>;
