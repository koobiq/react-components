'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';

import { useOverlayTriggerState } from '@koobiq/react-primitives';

import { Dialog } from '../Dialog';

import { PopoverInner } from './PopoverInner';
import type { PopoverProps } from './types';

const PopoverComponent = forwardRef<ComponentRef<'div'>, PopoverProps>(
  (props, ref) => {
    const { open, onOpenChange, defaultOpen, ...other } = props;

    const state = useOverlayTriggerState({
      isOpen: open,
      onOpenChange,
      defaultOpen,
      ...other,
    });

    return <PopoverInner popoverRef={ref} {...other} state={state} />;
  }
);

PopoverComponent.displayName = 'Popover';

type CompoundedComponent = typeof PopoverComponent & {
  Header: typeof Dialog.Header;
  Body: typeof Dialog.Body;
  Footer: typeof Dialog.Footer;
};

export const Popover = PopoverComponent as CompoundedComponent;

Popover.Header = Dialog.Header;
Popover.Body = Dialog.Body;
Popover.Footer = Dialog.Footer;
