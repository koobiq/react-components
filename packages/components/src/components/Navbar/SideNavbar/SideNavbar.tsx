'use client';

import { forwardRef, useRef, useState } from 'react';

import {
  clsx,
  mergeProps,
  useControlledState,
  useFocusRing,
  useHover,
} from '@koobiq/react-core';
import { useToolbar } from '@koobiq/react-primitives';

import { MenuPopoverContext } from '../../Menu/MenuPopoverContext';
import { Sidebar } from '../../Sidebar';
import {
  NavbarAction,
  NavbarAppItem,
  NavbarContext,
  NavbarDivider,
  NavbarItem,
} from '../components';

import {
  NavbarBody,
  NavbarFooter,
  NavbarHeader,
  NavbarToggleButton,
} from './components';
import s from './SideNavbar.module.css';
import type { SideNavbarProps } from './types';

// A menu opens beside the navbar, flush with its item's highlight.
const menuPopover = { placement: 'end top', offset: -8 } as const;

// The toggle button's shortcut, as in Koobiq Angular.
const toggleShortcut = { code: 'Slash', ctrlKey: true };

const SideNavbarComponent = forwardRef<HTMLElement, SideNavbarProps>(
  (
    {
      isCollapsed: isCollapsedProp,
      isToggleButtonHidden,
      defaultCollapsed,
      className,
      children,
      onCollapse,
      ...other
    },
    ref
  ) => {
    const toolbarRef = useRef<HTMLDivElement>(null);

    const { toolbarProps } = useToolbar(
      { orientation: 'vertical' },
      toolbarRef
    );

    const contentProps = mergeProps(
      { className: s.content, ref: toolbarRef },
      toolbarProps
    );

    const { hoverProps, isHovered } = useHover({});
    const { focusProps, isFocusVisible } = useFocusRing({ within: true });

    const [isCollapsed, setCollapsed] = useControlledState(
      isCollapsedProp,
      defaultCollapsed ?? false,
      onCollapse
    );

    const [isExpanded, setExpanded] = useState(!isCollapsed);

    const isToggleShown = isHovered || isFocusVisible;

    return (
      <Sidebar
        {...mergeProps(other, hoverProps, focusProps)}
        as="nav"
        ref={ref}
        size={240}
        closedSize={56}
        role="navigation"
        isOpen={!isCollapsed}
        keyboardShortcut={isToggleButtonHidden ? null : toggleShortcut}
        slotProps={{
          transition: {
            onEntered: () => setExpanded(true),
            onExit: () => setExpanded(false),
          },
        }}
        data-collapsed={isCollapsed}
        className={clsx(s.base, className)}
        onOpenChange={(isOpen) => setCollapsed(!isOpen)}
      >
        {({ isOpen, toggle }) => (
          <NavbarContext.Provider
            value={{
              orientation: 'vertical',
              isCollapsed: !isOpen,
              isExpanded,
            }}
          >
            <div {...contentProps}>
              <MenuPopoverContext.Provider value={menuPopover}>
                {children}
              </MenuPopoverContext.Provider>
            </div>

            {!isToggleButtonHidden && (
              <NavbarToggleButton
                onPress={toggle}
                isShown={isToggleShown}
                isCollapsed={isCollapsed}
              />
            )}
          </NavbarContext.Provider>
        )}
      </Sidebar>
    );
  }
);

SideNavbarComponent.displayName = 'SideNavbar';

/** The main menu of the product, along the side of the page. */
export const SideNavbar = Object.assign(SideNavbarComponent, {
  Header: NavbarHeader,
  Body: NavbarBody,
  Footer: NavbarFooter,
  Item: NavbarItem,
  AppItem: NavbarAppItem,
  Divider: NavbarDivider,
  Action: NavbarAction,
});
