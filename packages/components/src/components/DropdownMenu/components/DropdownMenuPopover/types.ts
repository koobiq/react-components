import type { CSSProperties, ReactNode, Ref, RefObject } from 'react';

import type { PopoverProps } from '../../../Popover';
import type { DropdownMenuPropPlacement } from '../../types';

export type DropdownMenuPopoverRef = HTMLDivElement;

export type DropdownMenuPopoverProps = {
  /** The content of the popover, usually a `DropdownMenu.Menu`. */
  children?: ReactNode;
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
  /** Ref to the popover element. */
  ref?: Ref<DropdownMenuPopoverRef>;

  /**
   * The placement of the popover with respect to its trigger.
   * @default 'bottom start' for a menu, 'end top' for a submenu
   */
  placement?: DropdownMenuPropPlacement;
  /**
   * The additional offset along the main axis between the popover and its trigger.
   * @default 4 for a menu, -4 for a submenu
   */
  offset?: number;
  /** The additional offset along the cross axis between the popover and its trigger. */
  crossOffset?: number;
  /**
   * The padding that should be applied between the popover and its surrounding container.
   * @default 12
   */
  containerPadding?: number;
  /** Whether the popover should flip when it reaches the viewport boundary. */
  shouldFlip?: boolean;
  /**
   * The maximum block size of the popover.
   * @default 480
   */
  maxBlockSize?: number;
  /** Whether the popover should not block interaction with the rest of the page. */
  isNonModal?: boolean;
  /** The ref for the element which the popover positions itself with respect to. */
  anchorRef?: RefObject<Element | null>;

  /** The props used for each slot inside. */
  slotProps?: {
    popover?: PopoverProps;
  };
};
