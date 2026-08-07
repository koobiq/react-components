'use client';

import { clsx } from '@koobiq/react-core';
import { Separator as AriaSeparator } from '@koobiq/react-primitives';

import s from './DropdownMenuSeparator.module.css';
import type { DropdownMenuSeparatorProps } from './types';

/** A line that visually separates groups of items inside a dropdown menu. */
export function DropdownMenuSeparator({
  className,
  ...props
}: DropdownMenuSeparatorProps) {
  return <AriaSeparator {...props} className={clsx(s.base, className)} />;
}

DropdownMenuSeparator.displayName = 'DropdownMenu.Separator';
