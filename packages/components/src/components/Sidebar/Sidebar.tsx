'use client';

import { useCallback } from 'react';
import type { ComponentPropsWithRef, CSSProperties, ElementType } from 'react';

import {
  clsx,
  polymorphicForwardRef,
  useControlledState,
  useDOMRef,
  useEventListener,
} from '@koobiq/react-core';
import { Transition } from 'react-transition-group';

import { TRANSITION_TIMEOUT } from './constants';
import type { SidebarBaseProps } from './index';
import s from './Sidebar.module.css';
import {
  isEditableTarget,
  matchesKeyboardShortcut,
  normalizeSize,
} from './utils';

/**
 * Sidebar is a low-level layout box for a side area that toggles between an open
 * and a closed state, animating its inline size between the two.
 */
export const Sidebar = polymorphicForwardRef<'div', SidebarBaseProps>(
  (props, ref) => {
    const {
      as: Tag = 'div',
      isOpen: isOpenProp,
      defaultOpen,
      onOpenChange,
      size,
      closedSize,
      placement = 'start',
      keyboardShortcut,
      slotProps,
      style,
      className,
      children,
      ...other
    } = props;

    const domRef = useDOMRef<HTMLElement>(ref);

    const [isOpen, setOpen] = useControlledState(
      isOpenProp,
      defaultOpen ?? false,
      onOpenChange
    );

    const open = useCallback(() => setOpen(true), [setOpen]);
    const close = useCallback(() => setOpen(false), [setOpen]);
    const toggle = useCallback(() => setOpen((is) => !is), [setOpen]);

    useEventListener({
      eventName: 'keydown',
      active: keyboardShortcut !== null,
      handler: (event) => {
        if (keyboardShortcut === null) return;

        const shortcut = keyboardShortcut ?? {
          code: placement === 'end' ? 'BracketRight' : 'BracketLeft',
        };

        if (!matchesKeyboardShortcut(event, shortcut)) return;
        if (isEditableTarget(event.target)) return;

        event.preventDefault();
        toggle();
      },
    });

    const sidebarStyle = {
      ...style,
      ...(size !== undefined && { '--kbq-sidebar-size': normalizeSize(size) }),
      ...(closedSize !== undefined && {
        '--kbq-sidebar-closed-size': normalizeSize(closedSize),
      }),
      '--kbq-sidebar-open-duration': `${TRANSITION_TIMEOUT.enter}ms`,
      '--kbq-sidebar-close-duration': `${TRANSITION_TIMEOUT.exit}ms`,
    } as CSSProperties;

    const transitionProps = {
      timeout: TRANSITION_TIMEOUT,
      in: isOpen,
      nodeRef: domRef,
      ...slotProps?.transition,
    };

    return (
      <Transition {...transitionProps}>
        {(transition) => {
          // The open content stays mounted for the whole collapse and is swapped
          // for the closed content only once the sidebar has finished collapsing.
          const isOpenState = transition !== 'exited';

          return (
            <Tag
              data-transition={transition}
              data-placement={placement}
              data-open={isOpenState || undefined}
              className={clsx(s.base, className)}
              style={sidebarStyle}
              {...other}
              ref={domRef}
            >
              {typeof children === 'function'
                ? children({ isOpen: isOpenState, open, close, toggle })
                : children}
            </Tag>
          );
        }}
      </Transition>
    );
  }
);

export type SidebarProps<As extends ElementType = 'div'> =
  ComponentPropsWithRef<typeof Sidebar<As>>;
