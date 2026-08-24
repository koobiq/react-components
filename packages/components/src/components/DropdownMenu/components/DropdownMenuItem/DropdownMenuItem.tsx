'use client';

import { once } from '@koobiq/logger';
import { clsx } from '@koobiq/react-core';
import { IconChevronRightS16 } from '@koobiq/react-icons';
import {
  MenuItem as AriaMenuItem,
  composeRenderProps,
} from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';
import { ListItemAddon } from '../../../List/components';

import s from './DropdownMenuItem.module.css';
import type { DropdownMenuItemProps } from './types';

const textVariant = utilClasses.typography;
const { listItem } = utilClasses;

/** An individual action inside a dropdown menu. */
export function DropdownMenuItem<T extends object = object>({
  children,
  className,
  textValue,
  align = 'center',
  ...props
}: DropdownMenuItemProps<T>) {
  if (
    process.env.NODE_ENV !== 'production' &&
    !textValue &&
    !props['aria-label'] &&
    typeof children !== 'string'
  ) {
    once.warn(
      'DropdownMenu.Item: add a `textValue` prop when the content is not plain text, otherwise search and typeahead cannot match the item.'
    );
  }

  return (
    <AriaMenuItem
      data-align={align}
      {...props}
      // The chevron wrapper below turns `children` into a render function,
      // so React Aria can no longer read plain text out of it on its own.
      textValue={textValue ?? (typeof children === 'string' ? children : '')}
      className={composeRenderProps(className, (className) =>
        clsx(s.base, listItem, textVariant['text-normal'], className)
      )}
    >
      {composeRenderProps(children, (children, { hasSubmenu }) => (
        <>
          {children}
          {hasSubmenu && (
            <ListItemAddon className={s.chevron}>
              <IconChevronRightS16 />
            </ListItemAddon>
          )}
        </>
      ))}
    </AriaMenuItem>
  );
}

DropdownMenuItem.displayName = 'DropdownMenu.Item';
