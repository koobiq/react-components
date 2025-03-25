import type {
  Ref,
  RefObject,
  ReactNode,
  ComponentRef,
  ReactElement,
  HTMLAttributes,
} from 'react';

import type { DataAttributeProps } from '@koobiq/react-core';

export type TooltipPropControl = (
  props: HTMLAttributes<HTMLButtonElement> & { ref?: Ref<HTMLButtonElement> }
) => ReactElement;

export const tooltipPropPlacement = [
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

export const tooltipPropVariant = [
  'contrast',
  'contrast-fade',
  'error',
  'warning',
  'theme',
] as const;

export type TooltipPropVariant = (typeof tooltipPropVariant)[number];

export type TooltipPropPlacement = (typeof tooltipPropPlacement)[number];

export type TooltipProps = {
  /**
   * The variant to use.
   * @default contrast
   * */
  variant?: TooltipPropVariant;
  /** If `true`, the component is shown. */
  open?: boolean;
  /** The default open state. Use when the component is not controlled. */
  defaultOpen?: boolean;
  /** Handler that is called when the overlay's open state changes. */
  onOpenChange?(open: boolean): void;
  /**
   * If `true`, the tooltip should be disabled, independent of the trigger.
   * @default false
   * */
  disabled?: boolean;
  /** The content of the component. */
  children?: ReactNode;
  /** The render function of the control for displaying the tooltip. */
  control?: TooltipPropControl;
  /**
   * The placement of the element with respect to its anchor element.
   * @default top
   * */
  placement?: TooltipPropPlacement;
  /** The ref for the element which the popover positions itself with respect to. */
  anchorRef?: RefObject<HTMLElement>;
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
  /**
   * If `true`, the arrow isn't shown.
   * @default false
   * */
  hideArrow?: boolean;
  /**
   * The delay time for the tooltip to show up.
   * @default 120
   */
  delay?: number;
  /**
   * The delay time for the tooltip to close.
   * @default 120
   */
  closeDelay?: number;
  /**
   * By default, opens for both focus and hover. Can be made to open only for focus.
   */
  trigger?: 'focus';
  /**
   * The element's unique identifier. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id).
   */
  id?: string;
  /** Additional CSS-classes. */
  className?: string;
  /**
   * The container element in which the component portal will be placed.
   * @default document.body
   */
  portalContainer?: Element;
} & DataAttributeProps;

export type TooltipRef = ComponentRef<'div'>;
