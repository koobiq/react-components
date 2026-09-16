'use client';

import { Tooltip, type TooltipProps } from '../../../Tooltip';

import s from './NavbarTooltip.module.css';

export type NavbarTooltipProps = Omit<
  TooltipProps,
  'offset' | 'hideArrow' | 'placement' | 'className'
>;

/** The tooltip of a navbar element: beside the navbar and non-interactive. */
export const NavbarTooltip = (props: NavbarTooltipProps) => (
  <Tooltip offset={8} hideArrow placement="end" className={s.base} {...props} />
);

NavbarTooltip.displayName = 'NavbarTooltip';
