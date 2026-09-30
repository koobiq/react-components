'use client';

import { forwardRef, useId } from 'react';
import type { AriaAttributes, ReactNode } from 'react';

import { clsx, isString, mergeProps, mergeRefs } from '@koobiq/react-core';
import type { ExtendableProps } from '@koobiq/react-core';

import { utilClasses } from '../../../../styles/utility';
import { Button, type ButtonProps } from '../../../Button';
import { useNavbarState } from '../NavbarContext';
import { NavbarTooltip } from '../NavbarTooltip';

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

export const NavbarAction = forwardRef<HTMLButtonElement, NavbarActionProps>(
  ({ icon, children, className, ...other }, ref) => {
    const { isCollapsed, orientation = 'vertical' } = useNavbarState();
    const labelId = useId();
    const ariaLabel = (other as AriaAttributes)['aria-label'];
    const ariaLabelledBy = (other as AriaAttributes)['aria-labelledby'];

    const needsHiddenLabel =
      isCollapsed && !isString(children) && !ariaLabel && !ariaLabelledBy;

    return (
      <div data-orientation={orientation} className={clsx(s.base, className)}>
        {needsHiddenLabel && (
          <span id={labelId} className={utilClasses.hideVisually}>
            {children}
          </span>
        )}

        <NavbarTooltip
          isDisabled={!isCollapsed}
          control={(tooltipProps) => (
            <Button
              // A collapsed button shows only its icon, so its text names it.
              aria-label={
                isCollapsed && isString(children) ? children : undefined
              }
              aria-labelledby={needsHiddenLabel ? labelId : undefined}
              {...mergeProps(tooltipProps, other)}
              className={s.button}
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
        </NavbarTooltip>
      </div>
    );
  }
);

NavbarAction.displayName = 'NavbarAction';
