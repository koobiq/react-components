'use client';

import { clsx } from '@koobiq/react-core';
import {
  Collection,
  Header as AriaHeader,
  MenuSection as AriaMenuSection,
} from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';

import type { DropdownMenuSectionProps } from './types';

const textVariant = utilClasses.typography;
const { listHeading, color } = utilClasses;

/** A group of related items inside a dropdown menu. */
export function DropdownMenuSection<T extends object = object>({
  title,
  items,
  children,
  className,
  dependencies,
  ...props
}: DropdownMenuSectionProps<T>) {
  return (
    <AriaMenuSection {...props} className={className}>
      {title != null && (
        <AriaHeader
          className={clsx(
            listHeading,
            textVariant['caps-compact-strong'],
            color.foreground['contrast-secondary']
          )}
        >
          {title}
        </AriaHeader>
      )}
      {typeof children === 'function' ? (
        <Collection items={items} dependencies={dependencies}>
          {children}
        </Collection>
      ) : (
        children
      )}
    </AriaMenuSection>
  );
}

DropdownMenuSection.displayName = 'DropdownMenu.Section';
