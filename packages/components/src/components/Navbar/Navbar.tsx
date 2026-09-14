'use client';

import { useRef } from 'react';

import {
  clsx,
  useControlledState,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';
import { IconChevronDoubleLeftS16 } from '@koobiq/react-icons';
import { Button, useToolbar } from '@koobiq/react-primitives';

import { Sidebar } from '../Sidebar';
import { Tooltip } from '../Tooltip';

import {
  NavbarAppItem,
  NavbarBody,
  NavbarFooter,
  NavbarHeader,
  NavbarItem,
} from './components';
import intlMessages from './intl.json';
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

  const [isCollapsed, setCollapsed] = useControlledState(
    isCollapsedProp,
    defaultCollapsed ?? false,
    onCollapse
  );

  const stringFormatter = useLocalizedStringFormatter(intlMessages);

  return (
    <Sidebar
      {...other}
      as="nav"
      className={clsx(s.base, className)}
      role="navigation"
      ref={ref}
      isOpen={!isCollapsed}
      onOpenChange={(isOpen) => setCollapsed(!isOpen)}
      size={240}
      closedSize={56}
      keyboardShortcut={null}
      data-collapsed={isCollapsed}
    >
      {({ isOpen, toggle }) => (
        <NavbarContext.Provider value={{ isCollapsed: !isOpen }}>
          <div className={s.content} ref={toolbarRef} {...toolbarProps}>
            {children}
          </div>

          {!isToggleButtonHidden && (
            <Tooltip
              offset={8}
              hideArrow
              placement="end"
              control={(tooltipProps) => (
                <Button
                  {...tooltipProps}
                  aria-label={stringFormatter.format(
                    isCollapsed ? 'show navbar' : 'hide navbar'
                  )}
                  aria-expanded={!isCollapsed}
                  className={s.toggleWrapper}
                  onPress={toggle}
                >
                  <span className={s.toggleButton}>
                    <IconChevronDoubleLeftS16 />
                  </span>
                </Button>
              )}
            >
              {stringFormatter.format(
                isCollapsed ? 'show navbar' : 'hide navbar'
              )}
            </Tooltip>
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
