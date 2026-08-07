import type { CSSProperties, ReactNode, Ref, RefObject } from 'react';

import type {
  MenuProps as AriaMenuProps,
  PopoverProps as AriaPopoverProps,
} from '@koobiq/react-primitives';

import type { DividerProps } from '../../../Divider';
import type { DropdownFooterProps } from '../../../DropdownFooter';
import type { SearchInputProps } from '../../../SearchInput';
import type { DropdownMenuPropPlacement } from '../../types';

export type DropdownMenuContentRef = HTMLElement;

type DropdownMenuContentOwnProps<T extends object> = {
  /** Additional CSS-classes. */
  className?: AriaPopoverProps['className'];
  /** Inline styles. */
  style?: CSSProperties;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
  /** Ref to the popover element. */
  ref?: Ref<DropdownMenuContentRef>;

  /**
   * The placement of the menu with respect to its trigger.
   * @default 'bottom start' for a menu, 'end top' for a submenu
   */
  placement?: DropdownMenuPropPlacement;
  /**
   * The additional offset along the main axis between the menu and its trigger.
   * @default 4
   */
  offset?: number;
  /** The additional offset along the cross axis between the menu and its trigger. */
  crossOffset?: number;
  /**
   * The padding that should be applied between the menu and its surrounding container.
   * @default 12
   */
  containerPadding?: number;
  /** Whether the menu should flip when it reaches the viewport boundary. */
  shouldFlip?: boolean;
  /**
   * The maximum block size of the menu.
   * @default 480
   */
  maxBlockSize?: number;
  /** Whether the menu should not block interaction with the rest of the page. */
  isNonModal?: boolean;
  /** The ref for the element which the menu positions itself with respect to. */
  anchorRef?: RefObject<HTMLElement | null>;

  /** Whether the menu items can be filtered with a search input. */
  isSearchable?: boolean;
  /** The search query (controlled). */
  inputValue?: string;
  /** The search query (uncontrolled). */
  defaultInputValue?: string;
  /** Handler that is called when the search query changes. */
  onInputChange?: (value: string) => void;
  /** The filter used to decide whether an item is included in the search results. */
  defaultFilter?: (textValue: string, inputValue: string) => boolean;
  /** Content to display when there are no items to show. */
  noItemsText?: ReactNode;

  /** Content to display at the bottom of the menu. */
  dropdownFooter?: ReactNode;

  /** The props used for each slot inside. */
  slotProps?: {
    popover?: AriaPopoverProps;
    menu?: Omit<AriaMenuProps<T>, 'children'>;
    'search-input'?: SearchInputProps;
    divider?: DividerProps;
    dropdownFooter?: DropdownFooterProps;
  };
};

export type DropdownMenuContentProps<T extends object = object> = Omit<
  AriaMenuProps<T>,
  'className' | 'style' | 'slot' | 'renderEmptyState'
> &
  DropdownMenuContentOwnProps<T>;
