import type {
  ComponentProps,
  ComponentPropsWithRef,
  ComponentRef,
  ElementType,
  CSSProperties,
  ReactElement,
  Ref,
  RefObject,
  ReactNode,
} from 'react';

import type { ExtendableProps, Pressable } from '@koobiq/react-core';
import type { ButtonOptions, AriaMenuProps } from '@koobiq/react-primitives';

import type {
  DividerProps,
  HeaderProps,
  ItemProps,
  SectionProps,
} from '../Collections';
import type { DropdownFooterProps } from '../DropdownFooter';
import type { ListItemTextProps } from '../List';
import type { ListItemAddonProps } from '../List/components';
import type { PopoverProps, PopoverPropPlacement } from '../Popover';

export type MenuItemProps<T> = ItemProps<T>;
export type MenuSectionProps<T> = SectionProps<T>;
export type MenuHeaderProps = HeaderProps;
export type MenuDividerProps = DividerProps;
export type MenuItemTextProps = ListItemTextProps;
export type MenuItemAddonProps = ListItemAddonProps;
export type MenuControlProps = ComponentProps<typeof Pressable>;

export type MenuPropControl = (
  props: Omit<ButtonOptions, 'elementType'> & {
    ref?: Ref<HTMLButtonElement>;
    as?: ElementType;
  }
) => ReactElement;

export type MenuPropPlacement = PopoverPropPlacement;

type MenuDeprecatedProps = {
  /**
   * If `true`, the component is shown.
   * @deprecated
   * The "open" prop is deprecated. Use "isOpen" prop to replace it.
   */
  open?: boolean;
};

export type MenuProps<T> = ExtendableProps<
  {
    /** Whether the overlay is open by default (controlled). */
    isOpen?: boolean;
    /** Whether the overlay is open by default (uncontrolled). */
    defaultOpen?: boolean;
    /** Handler that is called when the overlay's open state changes. */
    onOpenChange?: (isOpen: boolean) => void;
    /** Additional CSS-classes. */
    className?: string;
    /** Unique identifier for testing purposes. */
    'data-testid'?: string | number;
    /** Inline styles. */
    style?: CSSProperties;
    /** The render function of the control for displaying the modal window. */
    control?: MenuPropControl;
    /** The ref for the element which the popover positions itself with respect to. */
    anchorRef?: RefObject<HTMLElement | null>;
    /**
     * The placement of the element with respect to its anchor element.
     * @default 'bottom start'
     */
    placement?: MenuPropPlacement;
    /** Content to display at the bottom of the dropdown. */
    dropdownFooter?: ReactNode;
    /** Ref to the popover. */
    ref?: Ref<HTMLDivElement>;
    /** The props used for each slot inside. */
    slotProps?: {
      popover?: PopoverProps;
      dropdownFooter?: DropdownFooterProps;
      list?: ComponentPropsWithRef<'ul'>;
    };
  } & MenuDeprecatedProps,
  AriaMenuProps<T>
>;

export type MenuComponent = <T>(props: MenuProps<T>) => ReactElement | null;

export type MenuRef = ComponentRef<'div'>;
