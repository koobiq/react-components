'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';

import { deprecate } from '@koobiq/logger';
import { useOverlayTriggerState } from '@koobiq/react-primitives';

import { Dialog } from '../Dialog';

import { PopoverInner } from './PopoverInner';
import type { PopoverProps } from './types';

const PopoverComponent = forwardRef<ComponentRef<'div'>, PopoverProps>(
  (props, ref) => {
    const {
      open,
      isOpen: isOpenProp,
      onOpenChange,
      defaultOpen,
      ...other
    } = props;

    const isOpen = isOpenProp ?? open;

    if (process.env.NODE_ENV !== 'production' && 'open' in props) {
      deprecate(
        'Popover: the "open" prop is deprecated. Use "isOpen" prop to replace it.'
      );
    }

    const state = useOverlayTriggerState({
      isOpen,
      onOpenChange,
      defaultOpen,
      ...other,
    });

    return <PopoverInner popoverRef={ref} {...other} state={state} />;
  }
);

PopoverComponent.displayName = 'Popover';

/**
 * Popover component as an overlay whose position is anchored to an element in
 * the user interface.
 */
export const Popover = Object.assign(PopoverComponent, {
  Header: Dialog.Header,
  Body: Dialog.Body,
  Footer: Dialog.Footer,
});
