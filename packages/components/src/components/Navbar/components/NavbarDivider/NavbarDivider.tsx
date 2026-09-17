'use client';

import { clsx } from '@koobiq/react-core';
import type { DataAttributeProps } from '@koobiq/react-core';

import { Divider } from '../../../Divider';
import { useNavbarState } from '../NavbarContext';

import s from './NavbarDivider.module.css';

export type NavbarDividerProps = {
  /** Additional CSS-classes. */
  className?: string;
} & DataAttributeProps;

export const NavbarDivider = ({ className, ...props }: NavbarDividerProps) => {
  const { orientation = 'vertical' } = useNavbarState();

  return (
    // The line runs across the navbar, so it is turned the other way round.
    <Divider
      orientation={orientation === 'vertical' ? 'horizontal' : 'vertical'}
      disablePaddings
      className={clsx(s.base, className)}
      {...props}
    />
  );
};

NavbarDivider.displayName = 'NavbarDivider';
