import type { ComponentRef, ReactElement, Ref } from 'react';

import type { ButtonOptions, AriaMenuProps } from '@koobiq/react-primitives';

export type MenuPropControl = (
  props: ButtonOptions & { ref?: Ref<HTMLButtonElement> }
) => ReactElement;

export type MenuPropChildren<T extends object> = AriaMenuProps<T>['children'];

export type MenuPropItems<T extends object> = AriaMenuProps<T>['items'];

export const menuPropSelectionMode = ['none', 'single', 'multiple'] as const;

export type MenuPropSelectionMode = (typeof menuPropSelectionMode)[number];

export type MenuPropOnAction<T extends object> = AriaMenuProps<T>['onAction'];

export type MenuPropSelected<T extends object> =
  AriaMenuProps<T>['selectedKeys'];

export type MenuPropSelectionChange<T extends object> =
  AriaMenuProps<T>['onSelectionChange'];

export type MenuPropDisabledKeys<T extends object> =
  AriaMenuProps<T>['disabledKeys'];

export type MenuProps<T extends object> = {
  /** The contents of the collection. */
  children?: MenuPropChildren<T>;
  /** The render function of the control for displaying the modal window. */
  control?: MenuPropControl;
  /** Whether the overlay is open by default (controlled). */
  isOpen?: boolean;
  /** Whether the overlay is open by default (uncontrolled). */
  defaultOpen?: boolean;
  /** Handler that is called when the overlay's open state changes. */
  onOpenChange?: (isOpen: boolean) => void;
  /** Item objects in the collection. */
  items?: MenuPropItems<T>;
  /** The type of selection that is allowed in the collection. */
  selectionMode?: MenuPropSelectionMode;
  /**
   * Handler that is called when a user performs an action on an item. The exact user event depends on
   * the collection's `selectionBehavior` prop and the interaction modality.
   */
  onAction?: MenuPropOnAction<T>;
  selectedKeys?: MenuPropSelected<T>;
  onSelectionChange?: MenuPropSelectionChange<T>;
  disabledKeys?: MenuPropDisabledKeys<T>;
};

export type MenuComponentProps = <T extends object>(
  props: MenuProps<T>
) => ReactElement | null;

export type MenuRef = ComponentRef<'div'>;
