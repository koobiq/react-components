'use client';

import { Header as AriaHeader } from '@koobiq/react-primitives';

import type { DropdownMenuHeaderProps } from './types';

/**
 * A block of custom content inside a dropdown menu.
 * Inside a section it acts as the heading of that group.
 */
export function DropdownMenuHeader(props: DropdownMenuHeaderProps) {
  return <AriaHeader {...props} />;
}

DropdownMenuHeader.displayName = 'DropdownMenu.Header';
