import type {
  ComponentPropsWithRef,
  ComponentRef,
  CSSProperties,
  ReactElement,
  Ref,
  RefObject,
} from 'react';

import type { ButtonOptions, AriaMenuProps } from '@koobiq/react-primitives';

import type { PopoverBaseProps, PopoverPropPlacement } from '../Popover';

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

export type MenuPropPlacement = PopoverPropPlacement;

type MenuDeprecatedProps = {
  /**
   * If `true`, the component is shown.
   *
   * @deprecated
   * The "open" prop is deprecated. Use "isOpen" prop to replace it.
   */
  open?: boolean;
};

export type MenuProps<T extends object> = {
  /** Additional CSS-classes. */
  className?: string;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
  /** Inline styles. */
  style?: CSSProperties;
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
  /** The currently selected keys in the collection (controlled). */
  selectedKeys?: MenuPropSelected<T>;
  /** Handler that is called when the selection changes. */
  onSelectionChange?: MenuPropSelectionChange<T>;
  disabledKeys?: MenuPropDisabledKeys<T>;
  /** The ref for the element which the popover positions itself with respect to. */
  anchorRef?: RefObject<HTMLElement | null>;
  /**
   * The placement of the element with respect to its anchor element.
   * @default bottom start
   */
  placement?: MenuPropPlacement;
  /** Ref to the popover */
  ref?: Ref<HTMLDivElement>;
  /** The props used for each slot inside. */
  slotProps?: {
    popover?: PopoverBaseProps;
    list?: ComponentPropsWithRef<'ul'>;
  };
} & MenuDeprecatedProps;

export type MenuComponent = <T extends object>(
  props: MenuProps<T>
) => ReactElement | null;

export type MenuRef = ComponentRef<'div'>;
