'use client';

import { useRef, useState } from 'react';

import {
  clsx,
  mergeProps,
  useControlledState,
  useFocusWithin,
  useHover,
} from '@koobiq/react-core';
import { useToolbar } from '@koobiq/react-primitives';

import { Sidebar } from '../Sidebar';

import {
  NavbarAppItem,
  NavbarBody,
  NavbarFooter,
  NavbarHeader,
  NavbarItem,
  NavbarToggleButton,
} from './components';
import s from './Navbar.module.css';
import { NavbarContext } from './NavbarContext';
import type { NavbarProps } from './types';

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
  const [isFocusWithin, setFocusWithin] = useState(false);

  const { focusWithinProps } = useFocusWithin({
    onFocusWithinChange: setFocusWithin,
  });

  const [isCollapsed, setCollapsed] = useControlledState(
    isCollapsedProp,
    defaultCollapsed ?? false,
    onCollapse
  );

  const isToggleShown = isHovered || isFocusWithin;

  return (
    <Sidebar
      {...mergeProps(other, hoverProps, focusWithinProps)}
      as="nav"
      ref={ref}
      size={240}
      closedSize={56}
      role="navigation"
      isOpen={!isCollapsed}
      keyboardShortcut={null}
      data-collapsed={isCollapsed}
      className={clsx(s.base, className)}
      onOpenChange={(isOpen) => setCollapsed(!isOpen)}
    >
      {({ isOpen, toggle }) => (
        <NavbarContext.Provider value={{ isCollapsed: !isOpen }}>
          <div {...contentProps}>{children}</div>

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

/**
 * The main menu organizes navigation within the product. It consists of a logo,
 * section links, and can additionally include an app switcher, help section, and
 * settings block.
 */
export const Navbar = Object.assign(NavbarComponent, {
  Header: NavbarHeader,
  Body: NavbarBody,
  Footer: NavbarFooter,
  Item: NavbarItem,
  AppItem: NavbarAppItem,
});
