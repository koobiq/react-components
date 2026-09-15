'use client';

import { useRef, useState } from 'react';

import {
  clsx,
  mergeProps,
  useControlledState,
  useFocusRing,
  useHover,
} from '@koobiq/react-core';
import { useToolbar } from '@koobiq/react-primitives';

import { DropdownMenuPopoverContext } from '../DropdownMenu/components/DropdownMenuPopover/DropdownMenuPopoverContext';
import { Sidebar } from '../Sidebar';

import {
  NavbarAction,
  NavbarAppItem,
  NavbarBody,
  NavbarDivider,
  NavbarFooter,
  NavbarHeader,
  NavbarItem,
  NavbarToggleButton,
} from './components';
import s from './Navbar.module.css';
import { NavbarContext } from './NavbarContext';
import type { NavbarProps } from './types';

// A menu opens beside a vertical navbar, flush with its item's highlight.
const verticalMenuPopover = { placement: 'end top', offset: -8 } as const;

// The toggle button's shortcut, as in Koobiq Angular.
const toggleShortcut = { code: 'Slash', ctrlKey: true };

export const NavbarComponent = ({
  variant = 'vertical',
  isCollapsed: isCollapsedProp,
  isToggleButtonHidden,
  defaultCollapsed,
  className,
  children,
  onCollapse,
  ref,
  ...other
}: NavbarProps) => {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const { toolbarProps } = useToolbar({ orientation: variant }, toolbarRef);

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
        <NavbarContext.Provider value={{ isCollapsed: !isOpen, isExpanded }}>
          <div {...contentProps}>
            <DropdownMenuPopoverContext.Provider
              value={variant === 'vertical' ? verticalMenuPopover : null}
            >
              {children}
            </DropdownMenuPopoverContext.Provider>
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
};

NavbarComponent.displayName = 'Navbar';

/** The main menu of the product: the logo, section links and actions. */
export const Navbar = Object.assign(NavbarComponent, {
  Header: NavbarHeader,
  Body: NavbarBody,
  Footer: NavbarFooter,
  Item: NavbarItem,
  AppItem: NavbarAppItem,
  Divider: NavbarDivider,
  Action: NavbarAction,
});
