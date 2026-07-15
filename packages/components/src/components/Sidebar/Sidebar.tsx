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
import { isEditableTarget, normalizeSize } from './utils';

/**
 * Sidebar is a low-level layout box for a side area that toggles between an open
 * and a closed state, animating its inline size between the two.
 *
 * It renders arbitrary content — pass a function as `children` to render a
 * different tree per state. It is not an overlay: no backdrop, no focus trap, and
 * the content stays mounted while closed.
 *
 * Sidebar adds no ARIA semantics on its own. Supply them via standard attributes
 * (`as="nav"`, `role`, `aria-label`), and mark the toggle control you render with
 * `aria-expanded` and `aria-controls`.
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
      disableKeyboardShortcut = false,
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
      active: !disableKeyboardShortcut,
      handler: (event) => {
        // Matched by `code`, not `key`: on non-Latin layouts (e.g. ЙЦУКЕН) the
        // bracket keys produce other characters and `key` would never match.
        const code = placement === 'end' ? 'BracketRight' : 'BracketLeft';

        if (event.code !== code) return;
        if (event.ctrlKey || event.metaKey || event.altKey) return;
        if (isEditableTarget(event.target)) return;

        toggle();
      },
    });

    const sidebarStyle = {
      ...style,
      ...(size !== undefined && { '--sidebar-size': normalizeSize(size) }),
      ...(closedSize !== undefined && {
        '--sidebar-closed-size': normalizeSize(closedSize),
      }),
      '--sidebar-open-duration': `${TRANSITION_TIMEOUT.enter}ms`,
      '--sidebar-close-duration': `${TRANSITION_TIMEOUT.exit}ms`,
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
