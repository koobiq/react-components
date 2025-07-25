import type {
  ComponentPropsWithRef,
  ComponentRef,
  CSSProperties,
  ReactElement,
  Ref,
  RefObject,
} from 'react';

import type { ExtendableProps } from '@koobiq/react-core';
import type { ButtonOptions, AriaMenuProps } from '@koobiq/react-primitives';

import type { PopoverBaseProps, PopoverPropPlacement } from '../Popover';

export type MenuPropControl = (
  props: ButtonOptions & { ref?: Ref<HTMLButtonElement> }
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
    /** Ref to the popover. */
    ref?: Ref<HTMLDivElement>;
    /** The props used for each slot inside. */
    slotProps?: {
      popover?: PopoverBaseProps;
      list?: ComponentPropsWithRef<'ul'>;
    };
  } & MenuDeprecatedProps,
  AriaMenuProps<T>
>;

export type MenuComponent = <T>(props: MenuProps<T>) => ReactElement | null;

export type MenuRef = ComponentRef<'div'>;
