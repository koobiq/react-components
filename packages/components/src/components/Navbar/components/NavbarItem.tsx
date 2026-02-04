'use client';

import type { ReactNode } from 'react';

import {
  clsx,
  mergeProps,
  mergeRefs,
  polymorphicForwardRef,
} from '@koobiq/react-core';
import { IconChevronRight16 } from '@koobiq/react-icons';
import { Link, type LinkBaseProps } from '@koobiq/react-primitives';

import { utilClasses } from '../../../styles/utility';
import { Tooltip } from '../../Tooltip';
import s from '../Navbar.module.css';
import { useNavbarState } from '../NavbarContext';

export type NavbarItemProps = {
  /**
   * Whether the item is a menu trigger.
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
    { as, className, isMenu = false, icon, badge, children, ...other },
    inRef
  ) => {
    const { isCollapsed } = useNavbarState();

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
            {...mergeProps(props, other)}
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
