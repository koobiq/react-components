import type {
  ComponentPropsWithRef,
  CSSProperties,
  ReactElement,
  ReactNode,
  Ref,
  RefObject,
} from 'react';

import type { ButtonOptions } from '@koobiq/react-primitives';

import type { DialogProps } from '../Dialog';

export type PopoverPropContent =
  | ReactNode
  | ((props: { close(): void }) => ReactElement);

export type PopoverPropControl = (
  props: ButtonOptions & { ref?: Ref<HTMLButtonElement> }
) => ReactElement;

export const popoverPropPlacement = [
  'bottom',
  'bottom start',
  'bottom end',
  'top',
  'top start',
  'top end',
  'start',
  'start top',
  'start bottom',
  'end',
  'end top',
  'end bottom',
] as const;

export type PopoverPropPlacement = (typeof popoverPropPlacement)[number];

export const popoverPropSize = ['small', 'medium', 'large'] as const;

export type PopoverPropSize =
  | (typeof popoverPropSize)[number]
  | CSSProperties['inlineSize'];

export type PopoverProps = {
  /** If `true`, the component is shown. */
  open?: boolean;
  /** The default open state. Use when the component is not controlled. */
  defaultOpen?: boolean;
  /** The content of the component. */
  children?: PopoverPropContent;
  /** The render function of the control for displaying the modal window. */
  control?: PopoverPropControl;
  /**
   * Component width size.
   * @default medium
   * */
  size?: PopoverPropSize;
  /**
   * If `true`, the close button isn't shown.
   * @default false
   * */
  hideCloseButton?: boolean;
  /** Handler that is called when the modal's open state changes. */
  onOpenChange?: (open: boolean) => void;
  /**
   * The container element in which the component portal will be placed.
   * @default document.body
   */
  portalContainer?: Element;
  /**
   * If `true`, the modal window won't close when the ESC key is pressed.
   * @default false
   */
  disableExitOnEscapeKeyDown?: boolean;
  /** Additional CSS-classes. */
  className?: string;
  /** Unique identifier for testing purposes. */
  'data-testid'?: string | number;
  /**
   * If `true`, the focus trap in modal window is disabled.
   * @default false
   */
  disableFocusManagement?: boolean;
  /**
   * The placement of the element with respect to its anchor element.
   * @default top
   * */
  placement?: PopoverPropPlacement;
  /** The ref for the element which the popover positions itself with respect to. */
  anchorRef?: RefObject<HTMLElement>;
  /**
   * If `true`, the arrow isn't shown.
   * @default false
   * */
  hideArrow?: boolean;
  /**
   * Whether the popover is non-modal, i.e. elements outside the popover may be
   * interacted with by assistive technologies.
   *
   * Most popovers should not use this option as it may negatively impact the screen
   * reader experience. Only use with components such as combobox, which are designed
   * to handle this situation carefully.
   */
  isNonModal?: boolean;
  /**
   * The minimum distance the arrow's edge should be from the edge of the overlay element.
   * @default 0
   */
  arrowBoundaryOffset?: number;
  /**
   * The additional offset applied along the main axis between the element and its
   * anchor element.
   * @default 0
   */
  offset?: number;
  /**
   * The additional offset applied along the cross axis between the element and its
   * anchor element.
   * @default 0
   */
  crossOffset?: number;
  /** The props used for each slot inside. */
  slotProps?: {
    dialog?: DialogProps;
    arrow?: ComponentPropsWithRef<'div'>;
  };
};
