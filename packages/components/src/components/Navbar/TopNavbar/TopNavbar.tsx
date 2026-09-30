'use client';

import { forwardRef, useRef } from 'react';

import { clsx, mergeProps, useDOMRef } from '@koobiq/react-core';
import { useToolbar } from '@koobiq/react-primitives';

import {
  NavbarAction,
  NavbarAppItem,
  NavbarContext,
  NavbarDivider,
  NavbarItem,
} from '../components';

import { TopNavbarContainer } from './components';
import s from './TopNavbar.module.css';
import type { TopNavbarProps } from './types';

const TopNavbarComponent = forwardRef<HTMLElement, TopNavbarProps>(
  ({ className, children, ...other }, ref) => {
    const domRef = useDOMRef<HTMLElement>(ref);
    const toolbarRef = useRef<HTMLDivElement>(null);

    // The toolbar goes on the content, so the `nav` stays a landmark.
    const { toolbarProps } = useToolbar(
      { orientation: 'horizontal' },
      toolbarRef
    );

    return (
      <nav {...other} className={clsx(s.base, className)} ref={domRef}>
        <NavbarContext.Provider
          value={{ orientation: 'horizontal', isExpanded: true }}
        >
          <div
            {...mergeProps(
              { className: s.content, ref: toolbarRef },
              toolbarProps
            )}
          >
            {children}
          </div>
        </NavbarContext.Provider>
      </nav>
    );
  }
);

TopNavbarComponent.displayName = 'TopNavbar';

/** The main menu of the product, along the top of the page. */
export const TopNavbar = Object.assign(TopNavbarComponent, {
  Container: TopNavbarContainer,
  Item: NavbarItem,
  AppItem: NavbarAppItem,
  Divider: NavbarDivider,
  Action: NavbarAction,
});
