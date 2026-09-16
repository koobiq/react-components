'use client';

import { useContext } from 'react';
import type { AriaAttributes, ReactNode } from 'react';

import {
  clsx,
  isNotNil,
  mergeProps,
  mergeRefs,
  polymorphicForwardRef,
  useElementOverflow,
  useLocale,
} from '@koobiq/react-core';
import type { KeyboardEvents } from '@koobiq/react-core';
import { IconChevronDownS16, IconChevronRight16 } from '@koobiq/react-icons';
import {
  Link,
  RootMenuTriggerStateContext,
  type LinkBaseProps,
} from '@koobiq/react-primitives';

import { Badge } from '../../../Badge';
import { useNavbarState } from '../NavbarContext';
import { NavbarTooltip } from '../NavbarTooltip';

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
    const { isCollapsed, orientation = 'vertical' } = useNavbarState();
    const { direction } = useLocale();
    const content = useElementOverflow<HTMLSpanElement>();
    const ariaLabel = (other as AriaAttributes)['aria-label'];
    const hasChildren = isNotNil(children);
    const hasAriaLabel = isNotNil(ariaLabel) && ariaLabel.length > 0;
    const tooltipContent = hasChildren ? children : ariaLabel;

    const isVertical = orientation === 'vertical';

    // A `DropdownMenu` shares its state with the trigger, a `Menu` passes `aria-haspopup` to its `control`.
    const menuState = useContext(RootMenuTriggerStateContext);
    const hasPopup = Boolean((other as AriaAttributes)['aria-haspopup']);
    const isMenu = isMenuProp ?? (!!menuState || hasPopup);

    // A menu opens across the navbar: to the side of a vertical one, below a horizontal one.
    const openKey = isVertical
      ? direction === 'rtl'
        ? 'ArrowLeft'
        : 'ArrowRight'
      : 'ArrowDown';

    const onKeyDown: KeyboardEvents['onKeyDown'] = (e) => {
      if (e.key !== openKey) return;

      if (menuState) {
        e.preventDefault();
        menuState.open('first');
      } else if (hasPopup) {
        other.onKeyDown?.({ ...e, key: 'ArrowDown' });
      }
    };

    return (
      <NavbarTooltip
        // Shows the text when it is hidden or cut off, or the accessible label
        // when an icon-only item has no visible content.
        isDisabled={
          !hasChildren && !hasAriaLabel
            ? true
            : hasChildren && !isCollapsed && !content.isOverflow
        }
        control={(props) => (
          <Link
            as={as || (isMenu || !other.href ? 'button' : 'a')}
            className={clsx(s.base, className)}
            data-orientation={orientation}
            data-selected={isActive || undefined}
            data-collapsed={isCollapsed || undefined}
            aria-current={isActive ? 'page' : undefined}
            {...mergeProps(props, other, { onKeyDown })}
            ref={mergeRefs(props.ref, inRef)}
          >
            {isNotNil(icon) && (
              <span className={s.icon} data-slot="navbar-item-icon">
                {icon}
              </span>
            )}

            <span
              ref={content.ref}
              className={s.content}
              data-slot="navbar-item-content"
            >
              {children}
            </span>

            {isNotNil(badge) && (
              <Badge size="compact" variant="error" className={s.badge}>
                {badge}
              </Badge>
            )}

            {isMenu &&
              (isVertical ? (
                <IconChevronRight16 className={s.menuIcon} />
              ) : (
                <IconChevronDownS16 className={s.menuIcon} />
              ))}
          </Link>
        )}
      >
        {tooltipContent}
      </NavbarTooltip>
    );
  }
);

NavbarItem.displayName = 'NavbarItem';
