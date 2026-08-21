'use client';

import { DropdownFooter } from '../../../DropdownFooter';

import type { DropdownMenuFooterProps } from './types';

/** Text under the items of a dropdown menu. Stays put while the menu scrolls. */
export function DropdownMenuFooter(props: DropdownMenuFooterProps) {
  return <DropdownFooter {...props} />;
}

DropdownMenuFooter.displayName = 'DropdownMenu.Footer';
