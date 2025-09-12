import type {
  ReactNode,
  RefObject,
  ComponentRef,
  ReactElement,
  DOMAttributes,
} from 'react';

import type {
  DataAttributeProps,
  ExtendableProps,
  FocusableElement,
} from '@koobiq/react-core';
import type { TooltipTriggerProps } from '@koobiq/react-primitives';

export type TooltipPropControl = (
  props: DOMAttributes<FocusableElement | null> & {
    ref: ((node: FocusableElement | null) => void) | null;
  }
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

type TooltipDeprecatedProps = {
  /**
   * If `true`, the component is shown.
   * @deprecated
   * The "open" prop is deprecated. Use "isOpen" prop to replace it.
   */
  open?: boolean;
  /**
   * If `true`, the component is disabled.
   * The "disabled" prop is deprecated. Use "isDisabled" prop to replace it.
   */
  disabled?: boolean;
};

export type TooltipProps = ExtendableProps<
  {
    /**
     * The variant to use.
     * @default 'contrast'
     */
    variant?: TooltipPropVariant;
    /** The content of the component. */
    children?: ReactNode;
    /** The render function of the control for displaying the tooltip. */
    control?: TooltipPropControl;
    /**
     * The placement of the element with respect to its anchor element.
     * @default 'top'
     */
    placement?: TooltipPropPlacement;
    /** The ref for the element which the popover positions itself with respect to. */
    anchorRef?: RefObject<HTMLElement | null>;
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
     */
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
  } & TooltipDeprecatedProps &
    DataAttributeProps,
  TooltipTriggerProps
>;

export type TooltipRef = ComponentRef<'div'>;
