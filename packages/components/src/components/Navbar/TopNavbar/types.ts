import type { ComponentPropsWithRef, ReactNode } from 'react';

export type TopNavbarProps = {
  /** Additional CSS-classes. */
  className?: string;
  /** The containers of the navbar, e.g. `TopNavbar.Container`. */
  children?: ReactNode;
} & ComponentPropsWithRef<'nav'>;
