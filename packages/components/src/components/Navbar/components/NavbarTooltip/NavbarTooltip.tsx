'use client';

import { Tooltip, type TooltipProps } from '../../../Tooltip';
import { useNavbarState } from '../NavbarContext';

import s from './NavbarTooltip.module.css';

export type NavbarTooltipProps = Omit<
  TooltipProps,
  'offset' | 'hideArrow' | 'placement' | 'className'
>;

/** The tooltip of a navbar element: beside the navbar and non-interactive. */
export const NavbarTooltip = (props: NavbarTooltipProps) => {
  const { orientation = 'vertical' } = useNavbarState();

  return (
    <Tooltip
      offset={8}
      hideArrow
      placement={orientation === 'vertical' ? 'end' : 'bottom'}
      className={s.base}
      {...props}
    />
  );
};

NavbarTooltip.displayName = 'NavbarTooltip';
