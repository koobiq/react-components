'use client';

import { useContext } from 'react';

import { clsx, mergeProps } from '@koobiq/react-core';
import {
  PopoverContext,
  useSlottedContext,
  OverlayTriggerStateContext,
} from '@koobiq/react-primitives';

import type {
  PopoverProps,
  PopoverInnerProps,
  PopoverPropPlacement,
} from '../../../Popover';
import { PopoverInner } from '../../../Popover/PopoverInner';

import s from './DropdownMenuPopover.module.css';
import type { DropdownMenuPopoverProps } from './types';

/**
 * The overlay of a dropdown menu. Holds the menu and anything next to it,
 * such as a search field or a footer. Backs both the menu and any submenu.
 */
export function DropdownMenuPopover(props: DropdownMenuPopoverProps) {
  const {
    ref,
    style,
    children,
    className,
    placement,
    anchorRef,
    shouldFlip,
    isNonModal,
    offset = 4,
    crossOffset,
    containerPadding = 12,
    maxBlockSize = 480,
    'data-testid': testId,
    slotProps,
  } = props;

  // The trigger hands its popover the open state and the element to anchor to
  // through context.
  const state = useContext(OverlayTriggerStateContext);
  const context = useSlottedContext(PopoverContext) ?? {};

  if (!state) return null;

  const isSubmenu = context.trigger === 'SubmenuTrigger';

  const defaultPlacement: PopoverPropPlacement = isSubmenu
    ? 'end top'
    : 'bottom start';

  const popoverProps = mergeProps<
    [PopoverInnerProps, PopoverProps | undefined]
  >(
    {
      state,
      offset,
      shouldFlip,
      crossOffset,
      maxBlockSize,
      containerPadding,
      hideArrow: true,
      hideCloseButton: true,
      // The menu is sized by its items, between the bounds in the CSS.
      size: 'auto',
      // Skips the dialog wrapper: the menu brings its own role and label.
      type: 'menu',
      popoverRef: ref,
      'data-testid': testId,
      style: { ...context.style, ...style },
      className: clsx(s.base, className),
      slotProps: { container: { className: s.container } },
      anchorRef: anchorRef ?? context.triggerRef,
      isNonModal: isNonModal ?? context.isNonModal,
      shouldCloseOnInteractOutside: context.shouldCloseOnInteractOutside,
      placement: placement ?? defaultPlacement,
    },
    slotProps?.popover
  );

  return <PopoverInner {...popoverProps}>{children}</PopoverInner>;
}

DropdownMenuPopover.displayName = 'DropdownMenu.Popover';
