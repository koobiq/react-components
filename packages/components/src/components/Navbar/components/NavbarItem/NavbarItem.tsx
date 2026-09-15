'use client';

import { useContext } from 'react';
import type { AriaAttributes, ReactNode } from 'react';

import {
  clsx,
  mergeProps,
  mergeRefs,
  polymorphicForwardRef,
  useLocale,
} from '@koobiq/react-core';
import type { KeyboardEvents } from '@koobiq/react-core';
import { IconChevronRight16 } from '@koobiq/react-icons';
import {
  Link,
  RootMenuTriggerStateContext,
  type LinkBaseProps,
} from '@koobiq/react-primitives';

import { Tooltip } from '../../../Tooltip';
import { useNavbarState } from '../../NavbarContext';

import s from './NavbarItem.module.css';

export type NavbarItemProps = {
  /**
   * Whether the item is the current page: highlights it and sets `aria-current`.
   */
  isActive?: boolean;
  /**
   * Whether the item opens a menu: shows an arrow. Set automatically when the
   * item is the trigger of a `DropdownMenu` or a `Menu`.
   */
  isMenu?: boolean;
  /**
   * Additional CSS class name.
   */
  className?: string;
  /**
   * Icon to display before the item content.
   */
  icon?: ReactNode;
  /**
   * Badge content to display.
   */
  badge?: ReactNode;
  /**
   * Item content.
   */
  children?: ReactNode;
} & LinkBaseProps;

export const NavbarItem = polymorphicForwardRef<'a', NavbarItemProps>(
  (
    {
      as,
      className,
      isActive,
      isMenu: isMenuProp,
      icon,
      badge,
      children,
      ...other
    },
    inRef
  ) => {
    const { isCollapsed } = useNavbarState();
    const { direction } = useLocale();

    // A `DropdownMenu` shares its state with the trigger, a `Menu` passes `aria-haspopup` to its `control`.
    const menuState = useContext(RootMenuTriggerStateContext);
    const hasPopup = Boolean((other as AriaAttributes)['aria-haspopup']);
    const isMenu = isMenuProp ?? (!!menuState || hasPopup);

    // The navbar moves between items with ArrowDown, so a menu opens with ArrowRight.
    const onKeyDown: KeyboardEvents['onKeyDown'] = (e) => {
      if (e.key !== (direction === 'rtl' ? 'ArrowLeft' : 'ArrowRight')) return;

      if (menuState) {
        e.preventDefault();
        menuState.open('first');
      } else if (hasPopup) {
        other.onKeyDown?.({ ...e, key: 'ArrowDown' });
      }
    };

    return (
      <Tooltip
        offset={8}
        hideArrow
        placement="end"
        isDisabled={!isCollapsed}
        control={(props) => (
          <Link
            as={as || (isMenu || !other.href ? 'button' : 'a')}
            className={clsx(s.base, className)}
            data-selected={isActive || undefined}
            data-collapsed={isCollapsed || undefined}
            aria-current={isActive ? 'page' : undefined}
            {...mergeProps(props, other, { onKeyDown })}
            ref={mergeRefs(props.ref, inRef)}
          >
            {icon && (
              <span className={s.icon} data-slot="navbar-item-icon">
                {icon}
              </span>
            )}

            <span className={s.content}>{children}</span>

            {badge && <span className={s.badge}>{badge}</span>}

            {isMenu && <IconChevronRight16 className={s.menuIcon} />}
          </Link>
        )}
      >
        {children}
      </Tooltip>
    );
  }
);

NavbarItem.displayName = 'NavbarItem';
