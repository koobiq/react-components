'use client';

import type { ReactNode } from 'react';

import { clsx, isString, mergeProps, mergeRefs } from '@koobiq/react-core';
import type { ExtendableProps } from '@koobiq/react-core';

import { Button, type ButtonProps } from '../../../Button';
import { Tooltip } from '../../../Tooltip';
import { useNavbarState } from '../../NavbarContext';

import s from './NavbarAction.module.css';

export type NavbarActionProps = ExtendableProps<
  {
    /**
     * The icon of the button, e.g. `<IconPlus16 />`. Stays alone when the
     * navbar is collapsed.
     */
    icon?: ReactNode;
    /** The text of the button. Moves to a tooltip when the navbar is collapsed. */
    children?: ReactNode;
    /** Additional CSS-classes. */
    className?: string;
  },
  Omit<ButtonProps, 'startIcon' | 'endIcon' | 'onlyIcon' | 'fullWidth'>
>;

export const NavbarAction = ({
  icon,
  children,
  className,
  ref,
  ...other
}: NavbarActionProps) => {
  const { isCollapsed } = useNavbarState();

  return (
    <li className={clsx(s.base, className)}>
      <Tooltip
        offset={8}
        hideArrow
        placement="end"
        isDisabled={!isCollapsed}
        control={(tooltipProps) => (
          <Button
            // A collapsed button shows only its icon, so the text names it.
            aria-label={
              isCollapsed && isString(children) ? children : undefined
            }
            {...mergeProps(tooltipProps, other)}
            startIcon={icon}
            onlyIcon={isCollapsed}
            fullWidth
            ref={mergeRefs<HTMLButtonElement>(tooltipProps.ref, ref)}
          >
            {children}
          </Button>
        )}
      >
        {children}
      </Tooltip>
    </li>
  );
};

NavbarAction.displayName = 'NavbarAction';
