'use client';

import { clsx, mergeProps } from '@koobiq/react-core';
import type { PopoverProps as AriaPopoverProps } from '@koobiq/react-primitives';
import {
  Popover as AriaPopover,
  composeRenderProps,
} from '@koobiq/react-primitives';

import s from './DropdownMenuContent.module.css';
import { DropdownMenuContentInner } from './DropdownMenuContentInner';
import type { DropdownMenuContentProps } from './types';

/**
 * The popover of a dropdown menu, holding its items.
 * Backs both the menu and any submenu.
 */
export function DropdownMenuContent<T extends object = object>(
  props: DropdownMenuContentProps<T>
) {
  const {
    ref,
    style,
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
    ...other
  } = props;

  const { className: popoverClassName, ...popoverSlotProps } =
    slotProps?.popover ?? {};

  // Left undefined unless set, so the trigger's context defaults survive:
  // 'bottom start' for a menu, 'end top' for a submenu.
  const popoverProps = mergeProps<
    [AriaPopoverProps, Omit<AriaPopoverProps, 'className'>]
  >(
    {
      style,
      offset,
      placement,
      shouldFlip,
      isNonModal,
      crossOffset,
      containerPadding,
      triggerRef: anchorRef,
      maxHeight: maxBlockSize,
      className: composeRenderProps(
        popoverClassName,
        (popoverClassName, renderProps) =>
          clsx(
            s.popover,
            typeof className === 'function'
              ? className(renderProps)
              : className,
            popoverClassName
          )
      ),
    },
    popoverSlotProps
  );

  return (
    <AriaPopover ref={ref} data-testid={testId} {...popoverProps}>
      <DropdownMenuContentInner<T> {...other} slotProps={slotProps} />
    </AriaPopover>
  );
}

DropdownMenuContent.displayName = 'DropdownMenu.Content';
