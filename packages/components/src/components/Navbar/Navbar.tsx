'use client';

import {
  clsx,
  mergeProps,
  useControlledState,
  useLocalizedStringFormatter,
  useObjectRef,
} from '@koobiq/react-core';
import { IconChevronDoubleLeftS16 } from '@koobiq/react-icons';
import { Button, useToolbar } from '@koobiq/react-primitives';

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
  isCollapsed,
  isToggleButtonHidden,
  defaultCollapsed,
  className,
  children,
  onCollapse,
  ref,
  ...other
}: NavbarProps) => {
  const navbarRef = useObjectRef(ref);
  const { toolbarProps } = useToolbar({ orientation: variant }, navbarRef);

  const [isCollapsedActual, setIsCollapsedActual] = useControlledState(
    isCollapsed,
    defaultCollapsed ?? false,
    onCollapse
  );

  const stringFormatter = useLocalizedStringFormatter(intlMessages);

  return (
    <NavbarContext value={{ isCollapsed: isCollapsedActual }}>
      <nav
        {...mergeProps(other, toolbarProps)}
        className={clsx(s.navbar, className)}
        role="navigation"
        ref={navbarRef}
        data-collapsed={isCollapsedActual}
      >
        {children}

        {!isToggleButtonHidden && (
          <Tooltip
            offset={8}
            hideArrow
            placement="end"
            control={(tooltipProps) => (
              <Button
                {...tooltipProps}
                aria-hidden
                tabIndex={-1}
                className={s.toggleWrapper}
                onPress={() => setIsCollapsedActual((is) => !is)}
              >
                <span className={s.toggleButton}>
                  <IconChevronDoubleLeftS16 />
                </span>
              </Button>
            )}
          >
            {stringFormatter.format(
              isCollapsedActual ? 'show navbar' : 'hide navbar'
            )}
          </Tooltip>
        )}
      </nav>
    </NavbarContext>
  );
};

NavbarComponent.displayName = 'Navbar';

type CompoundedComponent = typeof NavbarComponent & {
  Header: typeof NavbarHeader;
  Body: typeof NavbarBody;
  Footer: typeof NavbarFooter;
  Item: typeof NavbarItem;
  AppItem: typeof NavbarAppItem;
};

export const Navbar = NavbarComponent as CompoundedComponent;

Navbar.Header = NavbarHeader;
Navbar.Body = NavbarBody;
Navbar.Footer = NavbarFooter;
Navbar.Item = NavbarItem;
Navbar.AppItem = NavbarAppItem;
