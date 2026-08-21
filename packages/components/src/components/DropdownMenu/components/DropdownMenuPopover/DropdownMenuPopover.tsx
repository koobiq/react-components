'use client';

import type { CSSProperties } from 'react';
import { useContext } from 'react';

import { once } from '@koobiq/logger';
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

type DropdownMenuPopoverStyle = CSSProperties & {
  '--dropdown-menu-popover-max-block-size': string;
};

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
    offset,
    placement,
    anchorRef,
    shouldFlip,
    isNonModal,
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

  if (!state) {
    if (process.env.NODE_ENV !== 'production') {
      once.warn(
        'DropdownMenu.Popover: render it inside a `DropdownMenu` or a `DropdownMenu.SubmenuTrigger`, they are what gives the popover its open state.'
      );
    }

    return null;
  }

  const isSubmenu = context.trigger === 'SubmenuTrigger';

  const defaultPlacement: PopoverPropPlacement = isSubmenu
    ? 'end top'
    : 'bottom start';

  // A submenu sits flush against its menu, a menu keeps a gap from its trigger.
  const defaultOffset = isSubmenu ? -4 : 4;

  const popoverProps = mergeProps<
    [PopoverInnerProps, PopoverProps | undefined]
  >(
    {
      state,
      shouldFlip,
      // Marks the overlay as a submenu for React Aria.
      trigger: context.trigger,
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
      offset: offset ?? defaultOffset,
    },
    slotProps?.popover
  );

  const popoverStyle: DropdownMenuPopoverStyle = {
    ...popoverProps.style,
    '--dropdown-menu-popover-max-block-size': `${popoverProps.maxBlockSize ?? maxBlockSize}px`,
  };

  return (
    <PopoverInner
      {...popoverProps}
      // Workaround for https://github.com/adobe/react-spectrum/issues/10176.
      // RAC only clears its previous calculated max height before re-measuring
      // when maxHeight is falsy. Passing 0 lets a collection populated on a
      // later render be measured again; our CSS keeps the public size limit.
      maxBlockSize={0}
      style={popoverStyle}
    >
      {children}
    </PopoverInner>
  );
}

DropdownMenuPopover.displayName = 'DropdownMenu.Popover';
