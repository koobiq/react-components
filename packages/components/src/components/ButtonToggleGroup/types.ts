import type { ComponentRef, ReactNode } from 'react';

import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';
import type { AriaToggleButtonGroupProps } from '@koobiq/react-primitives';

export type ButtonToggleGroupKey = string | number;

export type ButtonToggleGroupBaseProps = Omit<
  AriaToggleButtonGroupProps,
  | 'isDisabled'
  | 'orientation'
  | 'selectedKeys'
  | 'selectionMode'
  | 'onSelectionChange'
  | 'defaultSelectedKeys'
> & {
  /**
   * Whether all items are disabled.
   * @default false
   * */
  disabled?: boolean;
  /**
   * If `true`, the button will take up the full width of its container.
   * @default false
   * */
  fullWidth?: boolean;
  /** The contents of the collection. */
  children?: ReactNode;
  /**
   * If `true`, each item's width will be equal.
   * @default false
   * */
  equalItemSize?: boolean;
  /** The currently selected key in the collection (controlled). */
  selectedKey?: ButtonToggleGroupKey;
  /** The initial selected key in the collection (uncontrolled). */
  defaultSelectedKey?: ButtonToggleGroupKey;
  /** Handler that is called when the selection changes. */
  onSelectionChange?: (keys: ButtonToggleGroupKey) => void;
};

export type ButtonToggleGroupProps = ExtendableComponentPropsWithRef<
  ButtonToggleGroupBaseProps,
  'div'
>;

export type ButtonToggleGroupRef = ComponentRef<'div'>;
