'use client';

import { clsx } from '@koobiq/react-core';
import { IconChevronRightS16 } from '@koobiq/react-icons';
import {
  MenuItem as AriaMenuItem,
  composeRenderProps,
} from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';
import { ListItemAddon } from '../../../List/components';
import { getItemTextValue } from '../../utils';

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
  return (
    <AriaMenuItem
      data-align={align}
      {...props}
      textValue={
        textValue ??
        (typeof children === 'function'
          ? undefined
          : getItemTextValue(children)) ??
        ''
      }
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
