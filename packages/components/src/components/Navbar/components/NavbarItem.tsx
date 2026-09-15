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

import { utilClasses } from '../../../styles/utility';
import { Tooltip } from '../../Tooltip';
import s from '../Navbar.module.css';
import { useNavbarState } from '../NavbarContext';

export type NavbarItemProps = {
  /**
   * Whether the item is active.
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

const { listItem, typography } = utilClasses;

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
    const dropdownMenuState = useContext(RootMenuTriggerStateContext);

    const isMenuTrigger =
      !!dropdownMenuState ||
      ['true', 'menu'].includes(
        String((other as AriaAttributes)['aria-haspopup'])
      );

    const isMenu = isMenuProp ?? isMenuTrigger;

    // A menu opens on ArrowDown, but the navbar moves between items with it.
    const onKeyDown: KeyboardEvents['onKeyDown'] = (e) => {
      const openKey = direction === 'rtl' ? 'ArrowLeft' : 'ArrowRight';

      if (!isMenuTrigger || e.key !== openKey) return;

      if (dropdownMenuState) {
        e.preventDefault();
        dropdownMenuState.open('first');
      } else {
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
            className={clsx(
              listItem,
              typography['text-normal-medium'],
              s.item,
              className
            )}
            data-selected={isActive || undefined}
            aria-label={
              isCollapsed && typeof children === 'string' ? children : undefined
            }
            {...mergeProps(props, other, { onKeyDown })}
            ref={mergeRefs(props.ref, inRef)}
          >
            {icon && <span className={s.itemIcon}>{icon}</span>}

            {!isCollapsed && <span className={s.itemContent}>{children}</span>}

            {badge && (
              <span
                className={clsx(typography['text-compact-medium'], s.itemBadge)}
              >
                {badge}
              </span>
            )}

            {!isCollapsed && isMenu && (
              <IconChevronRight16 className={s.itemMenuIcon} />
            )}
          </Link>
        )}
      >
        {children}
      </Tooltip>
    );
  }
);

NavbarItem.displayName = 'NavbarItem';
